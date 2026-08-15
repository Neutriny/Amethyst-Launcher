use serde::Serialize;
use std::error::Error;

#[derive(Debug, Serialize, PartialEq, Eq)]
pub struct ArcMCError(pub String);

pub type ArcMCResult<T> = Result<T, ArcMCError>;

impl<T> From<T> for ArcMCError
where
  T: Error,
{
  fn from(err: T) -> Self {
    ArcMCError(err.to_string())
  }
}
