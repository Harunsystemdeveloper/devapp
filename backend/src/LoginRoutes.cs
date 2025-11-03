namespace WebApp;
public static class LoginRoutes
{
    private static Obj GetUser(HttpContext context)
    {
        return Session.Get(context, "user");
    }

    public static void Start()
    {
        App.MapPost("/api/login", (HttpContext context, JsonElement bodyJson) =>
        {
            var user = GetUser(context);
            var body = JSON.Parse(bodyJson.ToString());
            if (user != null)
            {
                return RestResult.Parse(context, new { error = "A user is already logged in." });
            }
            var dbUser = SQLQueryOne(
                "SELECT * FROM users WHERE email = $email",
                new { email = (string)body.email }
            );
            if (dbUser == null)
            {
                return RestResult.Parse(context, new { error = "No such user." });
            }
            if ((string)body.password != (string)dbUser.password)
            {
                return RestResult.Parse(context, new { error = "Password mismatch." });
            }
            dbUser.Delete("password");
            Session.Set(context, "user", dbUser);
            return RestResult.Parse(context, dbUser!);
        });

        App.MapGet("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            return RestResult.Parse(context, user != null ? user : new { error = "No user is logged in." });
        });

        App.MapDelete("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            Session.Set(context, "user", null);
            return RestResult.Parse(context, user == null ? new { error = "No user is logged in." } : new { status = "Successful logout." });
        });
    }
}
