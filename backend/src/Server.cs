namespace WebApp;
public static class Server
{
    public static void Start()
    {
        Middleware();
        DebugLog.Start();
        Acl.Start();
        ErrorHandler.Start();
        FileServer.Start();
        LoginRoutes.Start();
        RestApi.Start();
        Session.Start();
    }

    public static void Middleware()
    {
        App.Instance.Use(async (context, next) =>
        {
            context.Response.Headers.Append("Server", (string)Globals.serverName);
            DebugLog.Register(context);
            Session.Touch(context);
            if (!Acl.Allow(context))
            {
                context.Response.StatusCode = 405;
                var error = new { error = "Not allowed." };
                DebugLog.Add(context, error);
                await context.Response.WriteAsJsonAsync(error);
                return;
            }
            await next(context);
            var res = context.Response;
            var contentLength = res.ContentLength ?? 0;
            var info = Obj(new
            {
                statusCode = res.StatusCode,
                contentType = res.ContentType,
                contentLengthKB = Math.Round((double)contentLength / 10.24) / 100,
                RESPONSE_DONE = Now
            });
            if (info.contentLengthKB == null || info.contentLengthKB.Equals(0)) info.Delete("contentLengthKB");
            DebugLog.Add(context, info);
        });
    }
}
