"use client";

import { getContract } from "thirdweb";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { CROWDFUNDING_FACTORY } from "./constants/contract";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "../components/CampaignCard";

export default function Home() {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [],
  });
  console.log(campaigns);
  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaigns: </h1>
        <div className="grid grid-cols-3 gap-4">
          {!isLoading &&
            campaigns &&
            (campaigns?.length > 0 ? (
              campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                />
              ))
            ) : (
              <div>No Campaigns</div>
            ))}
        </div>
      </div>
    </main>
  );
}
