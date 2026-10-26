/**
 * Saturn 3D - Analytics & Event Measurement Hub
 * Supports Google Analytics 4 (GA4), Google Tag Manager (GTM), and Bing Webmaster Tools.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type AnalyticsEventType =
  | 'quote_form_submit'
  | 'file_upload'
  | 'whatsapp_click'
  | 'phone_click'
  | '3D_viewer_interaction';

export interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Dispatch generic event to GA4 dataLayer / gtag
 */
export function trackEvent(eventName: AnalyticsEventType, params: EventParams = {}) {
  try {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...params,
    };

    // Google Tag Manager dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);

      // Google Analytics 4 gtag.js
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      // Development logging
      if (import.meta.env.DEV) {
        console.log(`[Analytics Event: ${eventName}]`, payload);
      }
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * High-value conversion event: Quote Form Submission
 */
export function trackQuoteFormSubmit(quoteDetails: {
  material?: string;
  quantity?: number;
  estimatedPrice?: number;
  infill?: number;
  technology?: string;
}) {
  trackEvent('quote_form_submit', {
    category: 'Conversion',
    label: quoteDetails.material || 'Custom Specification',
    value: quoteDetails.estimatedPrice,
    ...quoteDetails,
  });
}

/**
 * CAD File Upload Event
 */
export function trackFileUpload(fileInfo: {
  fileName: string;
  fileSizeBytes: number;
  format: string;
}) {
  trackEvent('file_upload', {
    category: 'Engagement',
    label: fileInfo.format.toUpperCase(),
    value: Math.round(fileInfo.fileSizeBytes / 1024), // Size in KB
    ...fileInfo,
  });
}

/**
 * Direct WhatsApp Consultation Click
 */
export function trackWhatsAppClick(sourceLocation: string) {
  trackEvent('whatsapp_click', {
    category: 'Outbound Contact',
    label: sourceLocation,
  });
}

/**
 * Direct Phone Call Click
 */
export function trackPhoneClick(sourceLocation: string) {
  trackEvent('phone_click', {
    category: 'Outbound Contact',
    label: sourceLocation,
  });
}

/**
 * Interactive 3D Model / Viewer Interaction
 */
export function track3DViewerInteraction(action: 'rotate' | 'zoom' | 'material_switch' | 'layer_scrub', modelName: string) {
  trackEvent('3D_viewer_interaction', {
    category: '3D Experience',
    label: `${action}_${modelName}`,
    action,
    modelName,
  });
}
