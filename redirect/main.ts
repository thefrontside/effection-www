Deno.serve(() =>
  new Response(null, {
    headers: {
      "X-Robots-Tag": "noindex",
      "Location": "https://frontside.com/effection/",
    },
    status: 301,
    statusText: "Moved Permanently",
  })
);
