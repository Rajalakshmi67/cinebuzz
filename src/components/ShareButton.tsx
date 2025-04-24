import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ShareModal from "@/components/ShareModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShareButtonProps {
  contentId: number | string;
  contentType: 'movie' | 'tvshow';
  title: string;
  imageUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ contentId, contentType, title, imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 flex items-center"
              onClick={handleShareClick}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this with your friends!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentId={contentId}
        contentType={contentType}
        title={title}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default ShareButton;
