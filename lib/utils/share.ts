/**
 * Share Utilities
 * Utilities for sharing job listings via Web Share API and social platforms
 */

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'share' in navigator;
}

/**
 * Share via native Web Share API
 */
export async function shareViaWebShare(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Error sharing:', error);
    return false;
  }
}

/**
 * Share via WhatsApp
 * Uses API endpoint that works on both mobile and desktop
 */
export function shareViaWhatsApp(data: ShareData): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Format message with proper line breaks
    const message = `${data.title}\n\n${data.text}\n\n${data.url}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Use WhatsApp API URL that works universally
    // On mobile: Opens WhatsApp app if installed, otherwise WhatsApp Web
    // On desktop: Opens WhatsApp Web
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    console.log('Opening WhatsApp with URL:', whatsappUrl); // Debug log
    
    // Open in new window/tab
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.warn('Popup blocked, trying direct navigation');
      // If popup is blocked, try direct navigation
      window.location.href = whatsappUrl;
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    // Last resort: try direct navigation
    window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.title}\n\n${data.text}\n\n${data.url}`)}`;
  }
}

/**
 * Share via Twitter/X
 */
export function shareViaTwitter(data: ShareData): void {
  const text = encodeURIComponent(data.text);
  const url = encodeURIComponent(data.url);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

/**
 * Share via Facebook
 */
export function shareViaFacebook(url: string): void {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(fbUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

/**
 * Share via LinkedIn
 */
export function shareViaLinkedIn(url: string): void {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

/**
 * Copy link to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }
}

/**
 * Main share handler - tries Web Share API first, then falls back to platform-specific sharing
 */
export async function handleShare(
  data: ShareData,
  platform?: 'whatsapp' | 'twitter' | 'facebook' | 'linkedin' | 'copy'
): Promise<boolean> {
  // If specific platform is requested
  if (platform) {
    switch (platform) {
      case 'whatsapp':
        shareViaWhatsApp(data);
        return true;
      case 'twitter':
        shareViaTwitter(data);
        return true;
      case 'facebook':
        shareViaFacebook(data.url);
        return true;
      case 'linkedin':
        shareViaLinkedIn(data.url);
        return true;
      case 'copy':
        return await copyToClipboard(data.url);
      default:
        return false;
    }
  }

  // Try native Web Share API first
  const shared = await shareViaWebShare(data);
  return shared;
}

