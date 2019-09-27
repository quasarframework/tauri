use std::fs::{create_dir, create_dir_all, read_dir, remove_dir_all};
use std::path::{Path, PathBuf};

#[derive(Clone)]
pub struct DirOpts {
  pub depth: u64,
}

pub struct FileOpts {
  pub overwrite: bool,
  pub skip: bool,
  pub buffer_size: usize,
}

#[derive(Clone)]
pub struct Options {
  pub overwrite: bool,
  pub skip: bool,
  pub buffer_size: usize,
  pub copy_files: bool,
  pub content_only: bool,
  pub depth: u64,
}

pub struct DirInfo {
  pub size: u64,
  pub files: Vec<String>,
  pub directories: Vec<String>,
}

impl Options {
  pub fn new() -> Options {
    Options {
      overwrite: false,
      skip: false,
      buffer_size: 64000,
      copy_files: false,
      content_only: false,
      depth: 0,
    }
  }
}

impl DirOpts {
  pub fn new() -> DirOpts {
    DirOpts { depth: 0 }
  }
}

impl FileOpts {
  pub fn new() -> FileOpts {
    FileOpts {
      overwrite: false,
      skip: false,
      buffer_size: 64000,
    }
  }
}

pub fn create<P>(path: P, erase: bool) -> crate::Result<()>
where
  P: AsRef<Path>,
{
  if erase && path.as_ref().exists() {
    remove(&path)?;
  }
  Ok(create_dir(&path)?)
}

pub fn create_all<P>(path: P, erase: bool) -> crate::Result<()>
where
  P: AsRef<Path>,
{
  if erase && path.as_ref().exists() {
    remove(&path)?;
  }
  Ok(create_dir_all(&path)?)
}

pub fn remove<P: AsRef<Path>>(path: P) -> crate::Result<()> {
  if path.as_ref().exists() {
    Ok(remove_dir_all(path)?)
  } else {
    Ok(())
  }
}
