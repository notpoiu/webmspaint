function decodeBase64(str: string) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export async function GET(request: Request, path: { params: { path: string[] } }) {
    const response = await fetch(`https://api.github.com/repos/mspaint-cc/translations/contents/${path.params.path.join('/')}`, {
        headers: {
            Authorization: `Bearer ${process.env.TRANSLATION_GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        },
        next: {
            revalidate: 20
        }
    })

    const data = await response.json();
    
    if (data.message === "Not Found") {
        return new Response("Not found", { status: 404 });
    }

    const content = decodeBase64(data.content);

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
}