import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';


interface GitHubCommit {
    added: string[];
    modified: string[];
    removed: string[];
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
    name: string;
    email: string;
    username: string;
    };
}

interface GitHubPushEvent {
    ref: string;
    before: string;
    after: string;
    repository: {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    };
    commits: GitHubCommit[];
    head_commit: GitHubCommit;
}

const WEBHOOK_SECRET = process.env.GITHUB_CHANGELOG_WEBHOOK_SECRET!;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_CHANGELOG_WEBHOOK_URL!;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const jsonBody = JSON.parse(rawBody);

    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) {
      return NextResponse.json({ message: 'No signature found' }, { status: 401 });
    }

    const isValid = verifyGitHubWebhook(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (request.headers.get('x-github-event') !== 'push') {
      return NextResponse.json({ message: 'Ignoring non-push event' }, { status: 200 });
    }

    const changelogModified = (jsonBody as GitHubPushEvent).commits.some(commit => {
      return (
        commit.added.includes('changelogs.md') ||
        commit.modified.includes('changelogs.md')
      );
    });

    if (!changelogModified) {
      return NextResponse.json({ message: 'No changelogs.md changes' }, { status: 200 });
    }

    const changelogContent = await fetchChangelogContent();
    
    await sendToDiscord(changelogContent);

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}

function verifyGitHubWebhook(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('Warning: GITHUB_WEBHOOK_SECRET not configured');
    return false;
  }

  const sig = signature.substring(7);
  
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  
  const sigBuffer = Buffer.from(sig, 'hex');
  const digestBuffer = Buffer.from(digest, 'hex');
  
  return sigBuffer.length === digestBuffer.length && 
         crypto.timingSafeEqual(
           new Uint8Array(sigBuffer),
           new Uint8Array(digestBuffer)
         );
}

async function fetchChangelogContent() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/mspaint-cc/assets/contents/changelogs.md`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns content as base64
    const content = Buffer.from(data.content, 'base64').toString();
    return content;
  } catch (error) {
    console.error('Error fetching changelog:', error);
    throw new Error('Failed to fetch changelog content');
  }
}

async function sendToDiscord(content: string): Promise<void> {
    try {
        const chunks: string[] = [];
        let currentChunk: string = '';

        const lines: string[] = content.split('\n');
        for (const line of lines) {
            if (currentChunk.length + line.length + 1 > 1900) {
                chunks.push(currentChunk);
                currentChunk = line;
            } else {
                currentChunk += (currentChunk ? '\n' : '') + line;
            }
        }
        
        if (currentChunk) {
            chunks.push(currentChunk);
        }

        for (const chunk of chunks) {
            const response = await fetch(DISCORD_WEBHOOK_URL!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: chunk
                })
            });
            
            if (!response.ok) {
                throw new Error(`Discord webhook responded with status: ${response.status}`);
            }
        }
    } catch (error) {
        console.error('Error sending to Discord:', error);
        throw new Error('Failed to send to Discord webhook');
    }
}