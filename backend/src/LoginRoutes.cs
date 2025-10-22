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
            var currentUser = GetUser(context);
            var body = JSON.Parse(bodyJson.ToString());

            if (currentUser != null)
            {
                return RestResult.Parse(context, new { error = "En användare är redan inloggad." });
            }

          
            var email = (string)body.email;

        
            var dbUser = SQLQueryOne(
                "SELECT * FROM users WHERE email = $email",
                new { email }
            );

            if (dbUser == null)
            {
                return RestResult.Parse(context, new { error = "Ingen användare med den e-posten." });
            }

            var password = (string)body.password;
            var storedHash = (string)dbUser.password;

            
            if (!Password.Verify(password, storedHash))
            {
                return RestResult.Parse(context, new { error = "Fel lösenord." });
            }

            dbUser.Delete("password");
            Session.Set(context, "user", dbUser);

            return RestResult.Parse(context, dbUser!);
        });

      
        App.MapGet("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            return RestResult.Parse(context, user != null
                ? user
                : new { error = "Ingen användare är inloggad." });
        });

       
        App.MapDelete("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            Session.Set(context, "user", null);

            return RestResult.Parse(context, user == null
                ? new { error = "Ingen användare är inloggad." }
                : new { status = "Utloggad." });
        });
    }
}
