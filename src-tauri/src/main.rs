#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod model;
mod schema;
use chrono::Utc;
use schema::{CreateNoteSchema, UpdateNoteSchema};
use tauri::{Manager, State};

use model::{AuthorModel, NoteAuthorModel, NoteModel};
use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::runtime::Runtime;
use uuid::Uuid;

#[tauri::command]
async fn create_author(
    pool_wrapper: State<'_, PgPoolWrapper>,
    name: String,
) -> Result<AuthorModel, &str> {
    println!("Create User Hello, {}!", &name);

    let author_result = sqlx::query_as!(
        AuthorModel,
        "INSERT INTO author (name) VALUES ($1) RETURNING *",
        name.to_string()
    )
    .fetch_one(&pool_wrapper.pool)
    .await;

    if author_result.is_err() {
        let message = "Something bad happened while creating your user";

        println!("{}", &message);
        return Err(message);
    }

    let user = author_result.unwrap();

    Ok(user)
}

#[tauri::command]
async fn login_author(
    pool_wrapper: State<'_, PgPoolWrapper>,
    name: String,
) -> Result<AuthorModel, &str> {
    println!("Login User Hello, {}!", &name);

    let author_result = sqlx::query_as!(AuthorModel, "SELECT * FROM author WHERE name = $1", &name)
        .fetch_one(&pool_wrapper.pool)
        .await;

    if author_result.is_err() {
        let message = "Something bad happened while creating your note";

        println!("{}", &message);
        return Err(message);
    }

    let user = author_result.unwrap();

    Ok(user)
}

#[tauri::command]
async fn get_author_notes(
    pool_wrapper: State<'_, PgPoolWrapper>,
    author_id: Uuid,
) -> Result<Vec<NoteAuthorModel>, &str> {
    println!("get_all_notes");

    let query_result = sqlx::query_as!(
        NoteModel,
        "SELECT * FROM note n RIGHT JOIN author a ON n.author_id = a.author_id WHERE a.author_id = $1 ORDER by n.updated_at ",
        author_id
    )
    .fetch_all(&pool_wrapper.pool)
    .await;

    if query_result.is_err() {
        let message = "Something bad happened while fetching all note items";

        println!("{}", message);
        return Err(message);
    }

    let notes = query_result.unwrap();

    return Ok(notes);
}

#[tauri::command]
async fn get_all_notes(pool_wrapper: State<'_, PgPoolWrapper>) -> Result<Vec<NoteModel>, &str> {
    println!("get_all_notes");

    let limit = 15;

    let query_result = sqlx::query_as!(
        NoteModel,
        "SELECT * FROM note ORDER by updated_at LIMIT $1",
        limit as i32,
    )
    .fetch_all(&pool_wrapper.pool)
    .await;

    if query_result.is_err() {
        let message = "Something bad happened while fetching all note items";

        println!("{}", message);
        return Err(message);
    }

    let notes = query_result.unwrap();

    return Ok(notes);
}

#[tauri::command]
async fn create_note(
    pool_wrapper: State<'_, PgPoolWrapper>,
    note: CreateNoteSchema,
) -> Result<NoteModel, &str> {
    println!("create_note");

    let query_result = sqlx::query_as!(
        NoteModel,
        "INSERT INTO note (title,content,category,published,author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        note.title.to_string(),
        note.content.to_string(),
        note.category.to_owned().unwrap_or("".to_string()),
        note.published.to_owned().unwrap_or(false),
        note.author_id
    )
    .fetch_one(&pool_wrapper.pool)
    .await;

    if query_result.is_err() {
        let message = "Something bad happened while creating your note";

        println!("{}", message);
        return Err(message);
    }

    let note = query_result.unwrap();

    return Ok(note);
}

#[tauri::command]
async fn delete_note(pool_wrapper: State<'_, PgPoolWrapper>, id: Uuid) -> Result<&str, &str> {
    println!("delete_note {}", id);

    let rows_affected = sqlx::query!("DELETE FROM note WHERE note_id = $1", id)
        .execute(&pool_wrapper.pool)
        .await
        .unwrap()
        .rows_affected();

    if rows_affected == 0 {
        let message = "Something bad happened while deleting your note";

        println!("{}", message);
        return Err(message);
    }

    return Ok("Your note has been successfully deleted from the database");
}

#[tauri::command]
async fn update_note(
    pool_wrapper: State<'_, PgPoolWrapper>,
    note: UpdateNoteSchema,
) -> Result<NoteModel, &str> {
    println!("update_note {}", note.note_id);

    let get_result = sqlx::query_as!(
        NoteModel,
        "SELECT * FROM note WHERE note_id = $1",
        note.note_id
    )
    .fetch_one(&pool_wrapper.pool)
    .await;

    if get_result.is_err() {
        return Err("There was a problem updating your note");
    }

    let target_note = get_result.unwrap();

    let now = Utc::now();

    let query_result = sqlx::query_as!(
        NoteModel,
        "UPDATE note SET title = $1, content = $2, category = $3, published = $4 , updated_at = $5 WHERE note_id = $6 RETURNING *",
        note.title.to_owned().unwrap_or(target_note.title),
        note.content.to_owned().unwrap_or(target_note.content),
        note.category.to_owned().unwrap_or(target_note.category.unwrap()),
        note.published.to_owned().unwrap_or(target_note.published.unwrap()),
        now,
        note.note_id,
    )
    .fetch_one(&pool_wrapper.pool)
    .await;

    if query_result.is_err() {
        let message = "Something bad happened while deleting your note";

        println!("{}", message);
        return Err(message);
    }

    return Ok(query_result.unwrap());
}

async fn establish_connection() -> PgPool {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");

    let db_url = std::env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("Unable to connect to Postgres")
}

#[derive(Debug)]
struct PgPoolWrapper {
    pub pool: PgPool,
}

fn main() {
    let pool: PgPool = Runtime::new().unwrap().block_on(establish_connection());

    env_logger::init();

    println!("🚀 Server started successfully");

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .manage(PgPoolWrapper { pool: pool.clone() }) // Add PgPoolWrapper State.
        .invoke_handler(tauri::generate_handler![
            create_author,
            login_author,
            get_author_notes,
            get_all_notes,
            create_note,
            delete_note,
            update_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
