// path
import path from "path";

// fs
import fs from "fs/promises";

// pdf service
import { pdfService, PDFGenerationOptions } from "../services/pdf/index.js";

/**
 * Example usage of the PDF service with long text, bold formatting and logo
 */
async function exampleUsage() {
  try {
    console.log(
      "Generating advanced PDF with long text, bold formatting and logo..."
    );

    // Read the logo file (PNG as buffer)
    const logoPath = path.join(
      process.cwd(),
      "src",
      "assets",
      "logo",
      "black.png"
    );
    let logoData: Buffer;

    try {
      logoData = await fs.readFile(logoPath);
      console.log("Logo loaded successfully");
    } catch (error) {
      console.warn("Could not read logo file, using placeholder:", error);
      // Create a simple placeholder image if logo is not found
      const placeholderData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
        0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xcf, 0x00,
        0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb0, 0x00, 0x00, 0x00,
        0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      logoData = Buffer.from(placeholderData);
    }

    const longText = `**Propuesta de Servicio Legal Inteligente**

Este documento presenta una **propuesta integral** para un servicio de asistencia legal basado en inteligencia artificial que revoluciona la forma en que los profesionales del derecho y sus clientes interactúan con la información legal.

## **Características Principales del Servicio**

### **1. Análisis Inteligente de Documentos**
Nuestro sistema utiliza **algoritmos avanzados de procesamiento de lenguaje natural** para analizar documentos legales complejos. Puede identificar automáticamente:
- **Cláusulas importantes** y términos contractuales críticos
- **Riesgos legales** potenciales en acuerdos comerciales
- **Inconsistencias** en la documentación legal
- **Oportunidades de optimización** en contratos y acuerdos

### **2. Generación Automática de Resúmenes**
El servicio genera **resúmenes ejecutivos** de documentos legales extensos, destacando:
- **Puntos clave** de cada sección
- **Obligaciones principales** de las partes involucradas
- **Fechas críticas** y plazos importantes
- **Consecuencias legales** de incumplimientos

### **3. Asistencia en Investigación Legal**
Nuestra plataforma proporciona **herramientas de investigación avanzadas** que incluyen:
- **Búsqueda semántica** en bases de datos legales
- **Análisis de jurisprudencia** relevante
- **Comparación de casos** similares
- **Identificación de precedentes** legales importantes

## **Beneficios para Profesionales del Derecho**

### **Eficiencia Operativa**
Los abogados pueden **reducir significativamente el tiempo** dedicado a tareas repetitivas como:
- Revisión manual de contratos extensos
- Búsqueda de información legal específica
- Preparación de resúmenes ejecutivos
- Análisis de riesgos contractuales

### **Precisión y Consistencia**
El sistema garantiza **resultados consistentes** y **alta precisión** en:
- Identificación de términos legales críticos
- Análisis de riesgos y oportunidades
- Generación de documentación legal
- Cumplimiento normativo

### **Escalabilidad del Servicio**
La plataforma permite a los estudios jurídicos **manejar mayor volumen** de casos sin comprometer la calidad del servicio, facilitando:
- **Crecimiento del negocio** sin incrementos proporcionales en personal
- **Atención simultánea** de múltiples clientes
- **Optimización de recursos** humanos y tecnológicos

## **Aplicaciones Prácticas**

### **Derecho Corporativo**
- **Análisis de fusiones y adquisiciones**
- **Revisión de contratos comerciales**
- **Due diligence** automatizado
- **Cumplimiento regulatorio**

### **Derecho Laboral**
- **Análisis de contratos de trabajo**
- **Evaluación de políticas empresariales**
- **Gestión de conflictos laborales**
- **Cumplimiento de normativas laborales**

### **Derecho Civil**
- **Revisión de contratos de compraventa**
- **Análisis de acuerdos de arrendamiento**
- **Evaluación de responsabilidades civiles**
- **Gestión de sucesiones**

## **Tecnología y Seguridad**

### **Infraestructura Avanzada**
Nuestro sistema utiliza **tecnologías de vanguardia** incluyendo:
- **Machine Learning** especializado en lenguaje legal
- **Procesamiento de lenguaje natural** adaptado al contexto jurídico
- **Algoritmos de análisis semántico** para comprensión profunda
- **Sistemas de recomendación** inteligentes

### **Seguridad y Confidencialidad**
Garantizamos **máxima seguridad** en el manejo de información sensible:
- **Encriptación end-to-end** de todos los datos
- **Cumplimiento GDPR** y normativas de protección de datos
- **Auditorías de seguridad** regulares
- **Acceso controlado** y autenticación multifactor

## **Implementación y Soporte**

### **Proceso de Implementación**
Nuestro equipo proporciona **soporte completo** durante la implementación:
- **Configuración personalizada** según necesidades específicas
- **Capacitación del personal** en el uso de la plataforma
- **Migración de datos** existentes de forma segura
- **Integración** con sistemas actuales

### **Soporte Continuo**
Ofrecemos **soporte técnico especializado** que incluye:
- **Asistencia 24/7** para consultas técnicas
- **Actualizaciones regulares** del sistema
- **Mejoras continuas** basadas en feedback de usuarios
- **Capacitación adicional** según necesidades emergentes

## **Inversión y Retorno**

### **Modelo de Precios Transparente**
Nuestro modelo de precios está diseñado para **maximizar el retorno de inversión**:
- **Precios escalables** según el volumen de uso
- **Sin costos ocultos** o cargos adicionales
- **Períodos de prueba** gratuitos
- **Descuentos** para compromisos a largo plazo

### **Retorno de Inversión Esperado**
Los clientes pueden esperar **mejoras significativas** en:
- **Reducción del 60-80%** en tiempo de revisión de documentos
- **Aumento del 40-60%** en capacidad de manejo de casos
- **Mejora del 30-50%** en precisión de análisis legal
- **Reducción del 25-40%** en costos operativos

## **Conclusión**

Esta **plataforma revolucionaria** representa el futuro de la práctica legal, combinando la **experiencia humana** con la **eficiencia tecnológica** para proporcionar servicios legales superiores. Invitamos a su organización a ser parte de esta **transformación digital** del sector legal.

Para más información sobre cómo podemos **personalizar esta solución** para sus necesidades específicas, no dude en contactarnos. Estamos comprometidos con el **éxito de su práctica legal** y listos para demostrar el valor tangible que nuestra plataforma puede aportar a su organización.`;

    const advancedOptions: PDFGenerationOptions = {
      content: longText,
      title: "Propuesta de Servicio Legal Inteligente",
      author: "Tomas - Asistente Legal IA",
      subject: "Servicios de Inteligencia Artificial para el Sector Legal",
      keywords: [
        "IA",
        "legal",
        "automatización",
        "análisis",
        "contratos",
        "eficiencia",
      ],
      pageSize: "A4",
      orientation: "portrait",
      fontSize: 11,
      lineHeight: 1.4,
      margins: 50,
      coverPage: {
        title: "Propuesta de Servicio Legal Inteligente",
        author: "Tomas - Asistente Legal IA",
        logo: {
          data: logoData,
          name: "logo",
          width: 120,
          height: 60,
          format: "png",
        },
        showDate: true,
        customDate: "Enero 2025",
      },
      links: [
        {
          text: "Más información sobre nuestros servicios",
          url: "https://tomas-legal-ai.com",
          fontSize: 12,
        },
        {
          text: "Contacto para consultas",
          url: "mailto:contacto@tomas-legal-ai.com",
          fontSize: 12,
        },
      ],
    };

    const advancedResult = await pdfService.generatePDF(advancedOptions);
    await fs.writeFile("propuesta-servicio-legal.pdf", advancedResult.pdfBytes);

    console.log(
      `PDF generado exitosamente: ${advancedResult.size} bytes, ${advancedResult.pageCount} páginas`
    );
    console.log("Archivo guardado como: propuesta-servicio-legal.pdf");
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage();
}

export { exampleUsage };
