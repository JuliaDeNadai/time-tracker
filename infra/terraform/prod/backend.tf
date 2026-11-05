# Local state for now (no remote backend cost).
# State files are gitignored — do not commit terraform.tfstate.
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
