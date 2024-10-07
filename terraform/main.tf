provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "cheff-hat-terraform-state"
}