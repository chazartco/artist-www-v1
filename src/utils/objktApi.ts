import { Artwork } from '../types';

interface ObjktToken {
  name: string;
  description: string;
  artifact_uri: string;
  display_uri: string;
  dimensions: string;
  timestamp: string;
}

interface ObjktResponse {
  data: {
    fa: Array<{
      tokens: ObjktToken[];
    }>;
  };
}

function toIpfsGateway(uri: string | null): string | null {
  if (!uri) return null;
  if (uri.startsWith("ipfs://")) {
    return "https://ipfs.io/ipfs/" + uri.slice(7);
  }
  return uri;
}

function parseObjktUrl(url: string): { contract: string; tokenId: string } | null {
  try {
    const urlPattern = /https:\/\/objkt\.com\/tokens\/([^\/]+)\/(\d+)/;
    const match = url.match(urlPattern);
    
    if (!match) return null;
    
    return {
      contract: match[1],
      tokenId: match[2]
    };
  } catch (error) {
    return null;
  }
}

export async function fetchObjktData(urlOrContract: string, tokenId?: string): Promise<Artwork | null> {
  let contract: string;
  let token: string;

  // If tokenId is not provided, try to parse the URL
  if (!tokenId) {
    const parsed = parseObjktUrl(urlOrContract);
    if (!parsed) return null;
    contract = parsed.contract;
    token = parsed.tokenId;
  } else {
    contract = urlOrContract;
    token = tokenId;
  }

  const query = `
    query MyQuery {
      fa(where: {contract: {_eq: "${contract}"}}) {
        tokens(where: {token_id: {_eq: "${token}"}}) {
          name
          description
          artifact_uri
          display_uri
          dimensions
          timestamp
        }
      }
    }
  `;

  try {
    const response = await fetch("https://data.objkt.com/v3/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const json: ObjktResponse = await response.json();
    
    if (!json.data?.fa?.[0]?.tokens?.[0]) {
      return null;
    }

    const tokenData = json.data.fa[0].tokens[0];
    const artifactUrl = toIpfsGateway(tokenData.artifact_uri);
    const displayUrl = toIpfsGateway(tokenData.display_uri);

    if (!artifactUrl) {
      return null;
    }

    return {
      id: '', // This will be set when adding to the gallery
      title: tokenData.name,
      description: tokenData.description || '',
      imageUrl: artifactUrl,
      displayUrl: displayUrl || undefined,
      year: new Date(tokenData.timestamp).getFullYear().toString(),
      medium: 'Digital',
      dimensions: tokenData.dimensions || '',
      nftLink: `https://objkt.com/tokens/${contract}/${token}`,
      featured: false
    };
  } catch (error) {
    console.error('Error fetching OBJKT data:', error);
    return null;
  }
}