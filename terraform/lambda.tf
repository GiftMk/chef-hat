resource "aws_lambda_function" "image_processor_function" {
  s3_bucket     = aws_s3_bucket.lambda_artifacts_bucket.name
  s3_key        = "image-processor"
  function_name = "chef-hat-image-processor"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn
  memory_size   = 3000
  runtime       = "nodejs20.x"
  timeout       = 30
}

resource "aws_lambda_function" "audio_processor_function" {
  s3_bucket     = aws_s3_bucket.lambda_artifacts_bucket.name
  s3_key        = "audio_processor"
  function_name = "chef-hat-audio_processor"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn
  memory_size   = 3000
  runtime       = "nodejs20.x"
  timeout       = 120
}

resource "aws_lambda_function" "media_convert_function" {
  s3_bucket     = aws_s3_bucket.lambda_artifacts_bucket.name
  s3_key        = "audio_processor"
  function_name = "chef-hat-audio_processor"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn
  memory_size   = 3000
  runtime       = "nodejs20.x"
  timeout       = 120
}