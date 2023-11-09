use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct NoteModel {
    #[serde(rename = "noteId")]
    pub note_id: Uuid,
    #[serde(rename = "authorId")]
    pub author_id: Option<Uuid>,
    pub title: String,
    pub content: String,
    pub category: Option<String>,
    pub published: Option<bool>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}
#[derive(Debug, FromRow, Deserialize, Serialize)]
pub struct NoteAuthorModel {
    #[serde(rename = "noteId")]
    pub note_id: Uuid,
    #[serde(rename = "authorId")]
    pub author_id: Option<Uuid>,
    pub title: String,
    pub content: String,
    pub category: Option<String>,
    pub published: Option<bool>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
    pub name: String,
}

#[derive(Debug, FromRow, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct AuthorModel {
    #[serde(rename = "authorId")]
    pub author_id: Uuid,
    pub name: String,
}
