"use client";

import { PROJECT_TITLE } from "~/lib/constants";
import { StreamlinedNFTMinting } from "~/components/StreamlinedNFTMinting";

export default function App() {
  return (
    <div className="w-[400px] mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center">
      {/* TEMPLATE_CONTENT_START - Replace content below */}
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            NFT Collection
          </h1>
          <p className="text-muted-foreground">
            Connect your wallet and mint your exclusive NFT in just two clicks
          </p>
        </div>
        
        <StreamlinedNFTMinting
          contractAddress="0x1234567890123456789012345678901234567890"
          collectionName="Exclusive Collection"
          description="Limited edition NFTs available on Base and Ethereum. Only 1 NFT per wallet allowed."
        />
      </div>
      {/* TEMPLATE_CONTENT_END */}
    </div>
  );
}
