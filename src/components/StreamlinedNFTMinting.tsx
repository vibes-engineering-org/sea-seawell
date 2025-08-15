"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useAccount, useConnect, useSwitchChain, useBalance } from "wagmi";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { Wallet, Coins, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";
import { cn } from "~/lib/utils";
import { findChainByName } from "~/lib/chains";

// USDC contract addresses
const USDC_ADDRESSES = {
  ethereum: "0xA0b86a33E6441B73C3A8dc89e00b7C6b6FE52CE6", // USDC on Ethereum
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
} as const;

interface StreamlinedNFTMintingProps {
  /** The NFT contract address to mint from */
  contractAddress?: `0x${string}`;
  /** The collection name */
  collectionName?: string;
  /** Custom description for the collection */
  description?: string;
}

export function StreamlinedNFTMinting({
  contractAddress = "0x0000000000000000000000000000000000000000" as `0x${string}`,
  collectionName = "Sample NFT Collection",
  description = "Mint your exclusive NFT from this collection. Limited to 1 NFT per wallet.",
}: StreamlinedNFTMintingProps) {
  const [selectedChain, setSelectedChain] = React.useState<"ethereum" | "base">("base");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [hasMinted, setHasMinted] = React.useState(false);

  const { isSDKLoaded } = useMiniAppSdk();
  const { isConnected, address, chain } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();

  // Get chain info
  const targetChain = React.useMemo(() => {
    return findChainByName(selectedChain);
  }, [selectedChain]);

  const isCorrectNetwork = chain?.id === targetChain?.id;
  const usdcAddress = USDC_ADDRESSES[selectedChain];

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address,
    token: usdcAddress,
    chainId: targetChain?.id,
  });

  // Check if user has enough USDC (10 USDC = 10 * 10^6 because USDC has 6 decimals)
  const hasEnoughUSDC = usdcBalance && usdcBalance.value >= BigInt(10 * 10**6);

  // Simulate checking if user has already minted (in real implementation, this would query the contract)
  React.useEffect(() => {
    if (address && isConnected) {
      // In a real implementation, you would check the contract to see if this address has already minted
      // For demo purposes, we'll use localStorage to simulate this
      const key = `minted_${contractAddress}_${address}`;
      const alreadyMinted = localStorage.getItem(key) === "true";
      setHasMinted(alreadyMinted);
    }
  }, [address, isConnected, contractAddress]);

  const handleConnectWallet = async () => {
    if (!isSDKLoaded) {
      setError("Farcaster SDK not loaded");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const connector = farcasterFrame();
      await connect({ connector });
    } catch (err) {
      setError("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    if (!targetChain) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await switchChain({ chainId: targetChain.id });
    } catch (err) {
      setError(`Failed to switch to ${selectedChain}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!isConnected || !address || hasMinted) return;

    try {
      setIsLoading(true);
      setError(null);

      // Simulate minting process (in real implementation, this would interact with the contract)
      // 1. First approve USDC spending (if needed)
      // 2. Then call the mint function
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
      
      // Mark as minted in localStorage (simulate blockchain state)
      const key = `minted_${contractAddress}_${address}`;
      localStorage.setItem(key, "true");
      
      setHasMinted(true);
      setSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError("Minting failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canMint = isConnected && 
    isCorrectNetwork && 
    hasEnoughUSDC && 
    !hasMinted && 
    !isLoading;

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (!isCorrectNetwork) return `Switch to ${targetChain?.name}`;
    if (hasMinted) return "Already Minted";
    if (!hasEnoughUSDC) return "Insufficient USDC";
    return "Mint NFT";
  };

  const getButtonAction = () => {
    if (!isConnected) return handleConnectWallet;
    if (!isCorrectNetwork) return handleSwitchNetwork;
    return handleMint;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">NFT Minted Successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{collectionName}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              1 per wallet
            </Badge>
          </div>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Chain Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Network</label>
            <div className="flex gap-2">
              {(["ethereum", "base"] as const).map((chainName) => (
                <Button
                  key={chainName}
                  variant={selectedChain === chainName ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChain(chainName)}
                  disabled={isLoading}
                  className="flex-1 capitalize"
                >
                  {chainName}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-semibold">10 USDC</span>
            </div>
            {isConnected && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Your Balance</span>
                <span className="text-sm">
                  {usdcBalance ? `${(Number(usdcBalance.value) / 10**6).toFixed(2)} USDC` : "Loading..."}
                </span>
              </div>
            )}
          </div>

          {/* Network Warning */}
          {isConnected && !isCorrectNetwork && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-950 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Info className="h-4 w-4" />
                <span className="text-sm">Switch to {targetChain?.name} to continue</span>
              </div>
            </div>
          )}

          {/* Insufficient Balance Warning */}
          {isConnected && isCorrectNetwork && !hasEnoughUSDC && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">You need at least 10 USDC to mint</span>
              </div>
            </div>
          )}

          {/* Already Minted Warning */}
          {hasMinted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-950 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">You have already minted from this collection</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={getButtonAction()}
            disabled={hasMinted || isLoading || (!canMint && isConnected && isCorrectNetwork && !hasEnoughUSDC)}
            size="lg"
            className="w-full"
            variant={canMint ? "default" : "outline"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {!isConnected ? "Connecting..." : !isCorrectNetwork ? "Switching..." : "Minting..."}
              </>
            ) : (
              <>
                {!isConnected ? (
                  <Wallet className="h-4 w-4 mr-2" />
                ) : (
                  <Coins className="h-4 w-4 mr-2" />
                )}
                {getButtonText()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}