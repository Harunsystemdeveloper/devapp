using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Hosting;

namespace WebApp;

public static class App
{
    public static WebApplication Instance = null!;

    public static void Main(string[] args)
    {
        string port = args.Length > 0 ? args[0] : "5000";
        string frontendPath = args.Length > 1 ? args[1] : "../frontend";
        string dbPath = args.Length > 2 ? args[2] : "App_Data/db.sqlite3";

        Globals = Obj(new
        {
            debugOn = true,
            detailedAclDebug = false,
            aclOn = true,
            isSpa = true,
            port,
            serverName = "Minimal API Backend",
            frontendPath,
            dbPath,
            sessionLifeTimeHours = 2
        });

        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        Instance = app;

        Server.Start();

        app.Run($"http://localhost:{port}");
    }

    public static void MapGet(string pattern, Delegate handler) => Instance.MapGet(pattern, handler);
    public static void MapPost(string pattern, Delegate handler) => Instance.MapPost(pattern, handler);
    public static void MapPut(string pattern, Delegate handler) => Instance.MapPut(pattern, handler);
    public static void MapDelete(string pattern, Delegate handler) => Instance.MapDelete(pattern, handler);

    public static void UseStatusCodePages() => Instance.UseStatusCodePages();
    public static void UseStatusCodePages(RequestDelegate handler)
        => Instance.UseMiddleware<StatusCodePagesMiddleware>(handler);

    public static void UseExceptionHandler(string path) => Instance.UseExceptionHandler(path);
    public static void UseExceptionHandler(Action<IApplicationBuilder> configure)
        => Instance.UseExceptionHandler(configure);

    public static void UseFileServer(FileServerOptions options) => Instance.UseFileServer(options);
}
