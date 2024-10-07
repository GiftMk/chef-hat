resource "aws_s3_bucket" "input_bucket" {
  bucket = "chef-hat-video-maker-inputs"
}

resource "aws_s3_bucket" "output_bucket" {
  bucket = "chef-hat-video-maker-outputs"
}

resource "aws_s3_bucket" "lambda_artifacts_bucket" {
  bucket = "chef-hat-lambda-artifacts"
}