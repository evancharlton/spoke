terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

variable "cloudflare_api_token" {
  default = ""
}

locals {
  zones = {
    "spoke.no"        = "f5f71b6b8f2a52a60dde88181b8c0ce0"
    "xn--spke-hra.no" = "60facca24ebde192b657d661c9c2133f"
  }
  ip4_records = setproduct(
    toset(["xn--spke-hra.no", "spoke.no"]),
    [
      "185.199.111.153",
      "185.199.110.153",
      "185.199.109.153",
      "185.199.108.153"
    ]
  )
  ip6_records = setproduct(
    toset(["xn--spke-hra.no", "spoke.no"]),
    [
      "2606:50c0:8003::153",
      "2606:50c0:8002::153",
      "2606:50c0:8001::153",
      "2606:50c0:8000::153"
    ]
  )
  cnames = ["spoke.no", "xn--spke-hra.no"]
  ssl    = ["spoke.no", "xn--spke-hra.no"]
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "a_records" {
  for_each = {
    for val in local.ip4_records : "${val[0]}-${val[1]}" => {
      domain = val[0]
      ip     = val[1]
    }
  }
  zone_id = local.zones[each.value.domain]
  content = each.value.ip
  name    = each.value.domain
  proxied = true
  ttl     = 1
  type    = "A"
}

resource "cloudflare_record" "aaaa_records" {
  for_each = {
    for val in local.ip6_records : "${val[0]}-${val[1]}" => {
      domain = val[0]
      ip     = val[1]
    }
  }
  zone_id = local.zones[each.value.domain]
  content = each.value.ip
  name    = each.value.domain
  proxied = true
  ttl     = 1
  type    = "AAAA"
}

resource "cloudflare_record" "txt_records_no" {
  for_each = {
    # Tell recipients that this domain will never send email
    "_dmarc"                               = "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;",
    "*._domainkey"                         = "v=DKIM1; p=",
    "xn--spke-hra.no"                      = "v=spf1 -all",
    "_github-pages-challenge-evancharlton" = "ee90a25383ffe6a653b8c834a4b3c5",
  }
  zone_id = local.zones["xn--spke-hra.no"]
  name    = each.key
  content = each.value
  proxied = false
  ttl     = 1
  type    = "TXT"
}

resource "cloudflare_record" "cname_no" {
  for_each = toset(local.cnames)
  zone_id  = local.zones[each.value]
  name     = "www"
  content  = each.value
  proxied  = true
  ttl      = 1
  type     = "CNAME"
}

# NOTE: There's a bug in Cloudflare somewhere with this. If you run into
# problems, try this:
#  tofu state rm cloudflare_zone_settings_override.ssl_settings
#
# https://github.com/cloudflare/terraform-provider-cloudflare/issues/1297
resource "cloudflare_zone_settings_override" "ssl_settings" {
  for_each = toset(local.ssl)
  zone_id  = local.zones[each.value]

  settings {
    automatic_https_rewrites = "on"
    ssl                      = "full"
  }
}

# TODO: Figure out how to set up the redirect rule with Terraform/Tofu

# resource "cloudflare_record" "redirect_a_records" {
#   zone_id = local.zones["spoke.no"]
#   content = "192.0.2.1"
#   name    = "spoke.no"
#   proxied = true
#   ttl     = 1
#   type    = "A"
# }

# resource "cloudflare_record" "redirect_aaaa_records" {
#   for_each = {
#     for val in local.ip6_records : "${val[0]}-${val[1]}" => {
#       domain = val[0]
#       ip     = val[1]
#     }
#   }
#   zone_id = local.zones["spoke.no"]
#   content = "192::"
#   name    = "spoke.no"
#   proxied = true
#   ttl     = 1
#   type    = "AAAA"
# }

resource "cloudflare_record" "txt_records_spoke_no" {
  for_each = {
    # Tell recipients that this domain will never send email
    "_dmarc"                               = "\"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;\"",
    "*._domainkey"                         = "\"v=DKIM1; p=\"",
    "spoke.no"                             = "\"v=spf1 -all\"",
    "_github-pages-challenge-evancharlton" = "\"ee90a25383ffe6a653b8c834a4b3c5\"",
  }
  zone_id = local.zones["spoke.no"]
  name    = each.key
  content = each.value
  proxied = false
  ttl     = 1
  type    = "TXT"
}