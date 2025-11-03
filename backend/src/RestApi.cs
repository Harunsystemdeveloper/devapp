using Microsoft.Data.Sqlite;
using System.Text.Json;

namespace WebApp;

public static class RestApi
{
    private static string DbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "db.sqlite3");

    private static SqliteConnection GetConnection()
    {
        var connection = new SqliteConnection($"Data Source={DbPath}");
        connection.Open();
        return connection;
    }

    private static List<Dictionary<string, object>> SQLQuery(string sql, Dictionary<string, object> parameters = null, HttpContext context = null)
    {
        var result = new List<Dictionary<string, object>>();
        using var connection = GetConnection();
        using var command = new SqliteCommand(sql, connection);
        if (parameters != null)
        {
            foreach (var p in parameters)
                command.Parameters.AddWithValue($"${p.Key}", p.Value ?? DBNull.Value);
        }
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            var row = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
                row[reader.GetName(i)] = reader.GetValue(i);
            result.Add(row);
        }
        return result;
    }

    private static Dictionary<string, object> SQLQueryOne(string sql, Dictionary<string, object> parameters = null, HttpContext context = null)
    {
        var rows = SQLQuery(sql, parameters, context);
        return rows.Count > 0 ? rows[0] : new Dictionary<string, object>();
    }

    private static bool IsUserAllowed(HttpContext context, string table)
    {
        if (table != "users") return true;
        var user = Session.Get(context, "user");
        return user != null && ((string)user.role == "admin" || context.Request.Method == "GET");
    }

    public static void Start()
    {
        App.MapGet("/api/me", (HttpContext context) =>
        {
            var user = Session.Get(context, "user");
            if (user == null) return RestResult.Parse(context, new { error = "Not logged in" });
            return RestResult.Parse(context, user);
        });

        App.MapPost("/api/{table}", (HttpContext context, string table, JsonElement bodyJson) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.Delete("id");
            var parsed = ReqBodyParse(table, body);
            var columns = parsed.insertColumns;
            var values = parsed.insertValues;
            var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
            var result = SQLQueryOne(sql, parsed.body, context);
            if (!result.ContainsKey("error"))
            {
                var inserted = SQLQueryOne($"SELECT id AS __insertId FROM {table} ORDER BY id DESC LIMIT 1");
                result["insertId"] = inserted["__insertId"];
            }
            return RestResult.Parse(context, result);
        });

        App.MapGet("/api/{table}", (HttpContext context, string table) =>
        {
            if (!IsUserAllowed(context, table)) return RestResult.Parse(context, new { error = "Not authorized to access users" });
            var sql = $"SELECT * FROM {table}";
            return RestResult.Parse(context, SQLQuery(sql, null, context));
        });

        App.MapGet("/api/{table}/{id}", (HttpContext context, string table, string id) =>
        {
            var parameters = new Dictionary<string, object> { { "id", id } };
            return RestResult.Parse(context, SQLQueryOne($"SELECT * FROM {table} WHERE id = $id", parameters, context));
        });

        App.MapPut("/api/{table}/{id}", (HttpContext context, string table, string id, JsonElement bodyJson) =>
        {
            if (!IsUserAllowed(context, table)) return RestResult.Parse(context, new { error = "Not authorized to modify users" });
            var body = JSON.Parse(bodyJson.ToString());
            body.id = id;
            var parsed = ReqBodyParse(table, body);
            var update = parsed.update;
            var sql = $"UPDATE {table} SET {update} WHERE id = $id";
            var result = SQLQueryOne(sql, parsed.body, context);
            return RestResult.Parse(context, result);
        });

        App.MapDelete("/api/{table}/{id}", (HttpContext context, string table, string id) =>
        {
            var parameters = new Dictionary<string, object> { { "id", id } };
            var result = SQLQueryOne($"DELETE FROM {table} WHERE id = $id", parameters, context);
            return RestResult.Parse(context, result);
        });
    }
}

