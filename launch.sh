#!/usr/bin/env bash

usage() {
  cat <<USAGE >&2
usage: $0 REGION

Launch a bot in REGION.
USAGE
}

main() {
  local region=$1
  if [[ -z "${region}" ]]; then
    usage
    exit 1
  fi
  export AWS_REGION="${region}"

  local bot_id="${region}"
  local bot_city=
  local bot_lat=
  local bot_lon=
  case "${region}" in
    "ap-southeast-1")
      bot_city="Singapore"
      bot_lat="1.37"
      bot_lon="103.8"
      ;;
    "ap-southeast-2")
      bot_city="Sydney"
      bot_lat="-33.86"
      bot_lon="151.2"
      ;;
    "eu-west-1")
      bot_city="Dublin"
      bot_lat="53"
      bot_lon="-8"
      ;;
    "us-east-1")
      bot_city="Virginia"
      bot_lat="38.13"
      bot_lon="-78.45"
      ;;
    "us-west-1")
      bot_city="California"
      bot_lat="37.35"
      bot_lon="-121.96"
      ;;
    *)
      fail "unknown region: ${region}"
      ;;
  esac

  local vpc_id="$(aws ec2 describe-vpcs | jq -r '.Vpcs[] | select(.IsDefault) | .VpcId')"
  if [[ -z "${vpc_id}" ]]; then
    fail "could not determine VPC ID in ${region}"
  fi

  local subnet_id="$(aws ec2 describe-subnets --filter "Name=vpc-id,Values=${vpc_id}" | jq -r '.Subnets[0].SubnetId')"
  if [[ -z "${subnet_id}" ]]; then
    fail "could not determine subnet ID in ${region}"
  fi

  local sg_id="$(aws ec2 describe-security-groups --filter "Name=vpc-id,Values=${vpc_id}" --group-names "default" | jq -r '.SecurityGroups[0].GroupId')"
  if [[ -z "${sg_id}" ]]; then
    fail "could not determine security group ID in ${region}"
  fi

  local ami_id=$(curl -fsSL "https://cloud-images.ubuntu.com/query/focal/server/released.current.txt" | grep -F "${region}" | grep -F "amd64" | awk '{print $8}')
  if [[ -z "${ami_id}" ]]; then
    fail "could not determine AMI ID in ${region}"
  fi

  aws ec2 run-instances \
    --image-id             "${ami_id}" \
    --count                1 \
    --instance-type        t3.small \
    --security-group-ids   "${sg_id}" \
    --subnet-id            "${subnet_id}" \
    --iam-instance-profile "Name=AblyInstanceRole" \
    --user-data            "$(user_data)" \
    --tag-specifications   "ResourceType=instance,Tags=[{Key=Name,Value=ably-latency-map},{Key=Environment,Value=playground},{Key=Roles,Value=ably-latency-map}]"
}

user_data() {
  cat <<DATA
#cloud-config

apt:
  sources:
    docker.list:
      source: deb [arch=amd64] https://download.docker.com/linux/ubuntu \$RELEASE stable
      keyid: 9DC858229FC7DD38854AE2D88D81803C0EBFCD88

packages:
  - docker-ce
  - docker-ce-cli

runcmd:
 - /usr/bin/sleep 30
 - /usr/bin/docker run -d -e BOT_ID=${bot_id} -e BOT_CITY=${bot_city} -e BOT_LATITUDE=${bot_lat} -e BOT_LONGITUDE=${bot_lon} public.ecr.aws/c9o2o4s5/ably-latency-map
DATA
}

info() {
  local msg=$1
  local time="$(date +%H:%M:%S)"
  echo "===> ${time} ${msg}"
}

fail() {
  local msg=$1
  echo "ERROR: ${msg}" >&2
  exit 1
}

main "$@"
