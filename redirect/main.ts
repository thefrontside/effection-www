Deno.serve((request) => {
  let url = new URL(request.url);
  let location = new URL("https://frontside.com/");
  location.pathname = `/effection${url.pathname}`;
  return new Response(null, {
    headers: {
      "Location": String(location),
    },
    status: 301,
    statusText: "Moved Permanently",
  });
});
