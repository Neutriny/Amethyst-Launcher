use serde::Serialize;
use std::error::Error;

#[derive(Debug, Serialize, PartialEq, Eq)]
pub struct AMLError(pub String);

pub type AMLResult<T> = Result<T, AMLError>;

impl<T> From<T> for AMLError
where
  T: Error,
{
  fn from(err: T) -> Self {
    AMLError(err.to_string())
  }
}
