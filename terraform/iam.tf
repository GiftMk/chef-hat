data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name               = "chef-hat-lambda-execution-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement = {
    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ],
    resources = [
      "${aws_s3_bucket.input_bucket.arn}/*",
      "${aws_s3_bucket.output_bucket.arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_role_policy" {
  name   = "chef-hat-lambda-execution-role-policy"
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.aws_iam_policy_document.lambda_policy_document.json
}