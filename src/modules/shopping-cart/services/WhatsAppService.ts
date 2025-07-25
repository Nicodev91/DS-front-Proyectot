// Interfaces para WhatsApp
export interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  orderNumber?: string;
  customerName?: string;
  total?: string;
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class WhatsAppService {
  private formatPhoneNumber(phone: string): string {
    // Remover espacios, guiones y caracteres especiales
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si no empieza con +, agregar código de país de Chile
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.startsWith('56')) {
        cleanPhone = '+' + cleanPhone;
      } else if (cleanPhone.startsWith('9')) {
        cleanPhone = '+569' + cleanPhone.substring(1);
      } else {
        cleanPhone = '+56' + cleanPhone;
      }
    }
    
    return cleanPhone;
  }

  private generateOrderMessage(orderData: {
    orderNumber: string;
    customerName: string;
    total: string;
    orderDate: string;
  }): string {
    return `🛒 *Confirmación de Pedido*\n\n` +
           `¡Hola ${orderData.customerName}!\n\n` +
           `Tu pedido ha sido confirmado exitosamente:\n\n` +
           `📋 *Número de orden:* ${orderData.orderNumber}\n` +
           `💰 *Total:* ${orderData.total}\n` +
           `📅 *Fecha:* ${orderData.orderDate}\n\n` +
           `Nos pondremos en contacto contigo pronto para coordinar la entrega.\n\n` +
           `¡Gracias por tu compra! 🙏`;
  }

  async sendOrderConfirmation(orderData: {
    phoneNumber: string;
    orderNumber: string;
    customerName: string;
    total: string;
    orderDate: string;
  }): Promise<WhatsAppResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(orderData.phoneNumber);
      const message = this.generateOrderMessage(orderData);
      
      // Crear URL de WhatsApp Web
      const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp Web en una nueva ventana
      window.open(whatsappUrl, '_blank');
      
      return {
        success: true,
        messageId: `whatsapp_${Date.now()}`
      };
    } catch (error) {
      console.error('Error al enviar mensaje de WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async sendCustomMessage(phoneNumber: string, message: string): Promise<WhatsAppResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      return {
        success: true,
        messageId: `whatsapp_${Date.now()}`
      };
    } catch (error) {
      console.error('Error al enviar mensaje personalizado de WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  private generateCompanyOrderMessage(orderData: {
    orderNumber: string;
    customerName: string;
    total: string;
    orderDate: string;
    shippingAddress: string;
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  }): string {
    // Crear la sección de encabezado del mensaje
    let message = `🛒 *Nuevo Pedido Recibido*\n\n` +
           `📋 *Número de orden:* ${orderData.orderNumber}\n` +
           `👤 *Cliente:* ${orderData.customerName}\n` +
           `📍 *Dirección:* ${orderData.shippingAddress}\n` +
           `📅 *Fecha:* ${orderData.orderDate}\n\n`;
    
    // Agregar detalle de productos si está disponible
    if (orderData.items && orderData.items.length > 0) {
      message += `📝 *Detalle de productos:*\n`;
      
      let subtotal = 0;
      orderData.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `${index + 1}. ${item.name} - ${item.quantity} x $${item.price.toLocaleString('es-CL')} = $${itemTotal.toLocaleString('es-CL')} CLP\n`;
      });
      
      message += `\n*Subtotal:* $${subtotal.toLocaleString('es-CL')} CLP\n`;
      message += `*Total:* ${orderData.total}\n\n`;
    } else {
      message += `💰 *Total:* ${orderData.total}\n\n`;
    }
    
    message += `Hola, este es el detalle de mi pedido.`;
    
    return message;
  }

  async sendOrderToCompany(orderData: {
    orderNumber: string;
    customerName: string;
    total: string;
    orderDate: string;
    shippingAddress: string;
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  }): Promise<WhatsAppResponse> {
    try {
      const companyPhone = import.meta.env.VITE_COMPANY_WHATSAPP || '+56948853814';
      const message = this.generateCompanyOrderMessage(orderData);
      
      // Crear URL de WhatsApp Web para la empresa
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${companyPhone.replace('+', '')}&text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp Web en una nueva ventana
      window.open(whatsappUrl, '_blank');
      
      return {
        success: true,
        messageId: `whatsapp_company_${Date.now()}`
      };
    } catch (error) {
      console.error('Error al enviar pedido a la empresa por WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

export const whatsAppService = new WhatsAppService();
export default WhatsAppService;