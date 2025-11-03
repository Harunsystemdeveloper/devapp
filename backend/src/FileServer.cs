using Microsoft.Extensions.FileProviders;

namespace WebApp;

public static class FileServer
{
    private static string FPath;

    public static void Start()
    {
        FPath = Path.Combine(Directory.GetCurrentDirectory(), Globals.frontendPath);
        HandleStatusCodes();
        ServeFiles();
        ServeFileLists();
    }

    private static void HandleStatusCodes()
    {
        App.Instance.Use(async (context, next) =>
        {
            await next();
            
            var response = context.Response;
            var request = context.Request;
            var statusCode = response.StatusCode;
            var isInApi = request.Path.StartsWithSegments("/api");
            var isFilePath = (request.Path + "").Contains('.');
            var type = isInApi || statusCode != 404
                ? "application/json; charset=utf-8"
                : "text/html";
            var error = statusCode == 404
                ? "404. Not found."
                : "Status code: " + statusCode;

            response.ContentType = type;

            if (Globals.isSpa && !isInApi && !isFilePath && statusCode == 404)
            {
                response.StatusCode = 200;
                await response.WriteAsync(File.ReadAllText(Path.Combine(FPath, "index.html")));
            }
            else
            {
                await response.WriteAsJsonAsync(new { error });
            }
        });
    }

    private static void ServeFiles()
    {
        App.UseFileServer(new FileServerOptions
        {
            FileProvider = new PhysicalFileProvider(FPath)
        });
    }

    private static void ServeFileLists()
    {
        App.MapGet("/api/files/{folder}", (HttpContext context, string folder) =>
        {
            object result = null;
            try
            {
                result = Arr(Directory.GetFiles(Path.Combine(FPath, folder)))
                    .Map(x => Arr(x.Split('/')).Pop())
                    .Filter(x => Acl.Allow(context, "GET", "/content/" + x));
            }
            catch (Exception) { }
            return RestResult.Parse(context, result);
        });
    }
}
