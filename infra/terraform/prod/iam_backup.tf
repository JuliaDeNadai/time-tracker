resource "aws_iam_user" "backup" {
  name = "time-tracker-backup"
  path = "/"

  tags = {
    Project = "time-tracker"
    Purpose = "mongo-backup-github-actions"
  }
}

resource "aws_iam_access_key" "backup" {
  user = aws_iam_user.backup.name
}

resource "aws_iam_user_policy" "backup" {
  name = "time-tracker-backup-s3-put"
  user = aws_iam_user.backup.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "PutBackupObjectsOnly"
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = ["${aws_s3_bucket.mongo_backups.arn}/*"]
      }
    ]
  })
}
