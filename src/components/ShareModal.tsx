import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: number | string;
  contentType: 'movie' | 'tvshow';
  title: string;
  imageUrl: string;
}

interface SharingPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: (url: string, text: string) => string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, contentId, contentType, title, imageUrl }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate a shareable link
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/${contentType === 'movie' ? 'movie' : 'tv-show'}/${contentId}`;
  const shareText = `Check out ${title} on CineBuzz!`;
  
  // Define sharing platforms
  const platforms: SharingPlatform[] = [
    {
      name: 'WhatsApp',
      icon: '/whatsapp.svg',
      color: 'bg-[#25D366]',
      shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      name: 'Telegram',
      icon: '/telegram.svg',
      color: 'bg-[#0088cc]',
      shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      name: 'Instagram',
      icon: '/instagram.svg',
      color: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
      shareUrl: (url, text) => `https://www.instagram.com/`,
    },
    {
      name: 'Twitter',
      icon: '/twitter.svg',
      color: 'bg-[#1DA1F2]',
      shareUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
  ];

  // Handle copying link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Handle native sharing if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "Content has been shared using your device's share feature.",
        });
        onClose();
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  // Handle platform-specific sharing
  const handlePlatformShare = (platform: SharingPlatform) => {
    window.open(platform.shareUrl(shareUrl, shareText), '_blank');
    toast({
      title: `Sharing to ${platform.name}`,
      description: "Opening sharing page...",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-cinebuzz-card border-cinebuzz-accent/30 backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Share this content</DialogTitle>
          <Button 
            className="absolute right-4 top-4 p-1 rounded-full h-8 w-8" 
            variant="ghost" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="flex gap-4 items-center mb-4">
          <div className="h-16 w-12 rounded-md overflow-hidden flex-shrink-0">
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          </div>
          <div className="flex-grow">
            <h3 className="text-white font-medium line-clamp-1">{title}</h3>
            <p className="text-cinebuzz-subtitle text-sm">Share this with your friends!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handlePlatformShare(platform)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-cinebuzz-background/50 hover:bg-cinebuzz-background transition-colors"
            >
              <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center`}>
                <img src={platform.icon} alt={platform.name} className="w-5 h-5" />
              </div>
              <span className="text-white text-xs">{platform.name}</span>
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 items-center bg-cinebuzz-background/50 p-2 rounded-lg">
          <div className="flex-grow text-cinebuzz-subtitle text-sm truncate px-2">
            {shareUrl}
          </div>
          <Button 
            variant="outline" 
            className="bg-transparent border-white/20 text-white hover:bg-white/10 p-2 h-9" 
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
        
        {navigator.share && (
          <Button 
            variant="default" 
            className="w-full bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 mt-4" 
            onClick={handleNativeShare}
          >
            Use device sharing
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
