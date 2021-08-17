#!/bin/bash
# This script is to help upgrade from Proxmox 6.4 to 7.0. 
#
# Backup your stuff first! Make sure you run "pve6to7 --full" witout warnings or failures first.
#
# This script assumes you have already prepared for the upgrade. 
#
TARGET=/etc/apt/sources.list
BACKUP=/etc/apt/sources.d10

echo "Making sure system is up to date.."

apt-get clean
apt-get update
apt-get upgrade

echo "Starting upgrade process.."

# Make sure the backup file is not already present.
if test -f "$BACKUP" ; then
  echo -e "The backup file '$BACKUP' is already present; has this script failed before?\n\nDo you want continue without making a backup of '$TARGET'? [i,a](Default: a)"
  echo ""
  read ab;

  if [ "$ab" != "I" ] && [ "$ab" != "i" ]; then
        echo "User aborted.";
        exit;
  else 
        echo "Continuing without making backup of present '$TARGET'."
  fi
else 
 cp $TARGET $BACKUP
fi
  
> $TARGET

echo "deb http://deb.debian.org/debian bullseye main contrib" >> $TARGET
echo "deb http://deb.debian.org/debian bullseye-updates main contrib" >> $TARGET
echo "deb http://security.debian.org/debian-security bullseye-security main" >> $TARGET
echo "deb http://ftp.debian.org/debian bullseye-backports main contrib" >> $TARGET
echo "deb http://download.proxmox.com/debian/pve bullseye pve-no-subscription" >> $TARGET

apt-get clean
apt-get update
apt dist-upgrade
apt-get autoremove

# Remove this pesky file if it's present. This script was written for a non-enterprise environment.
if test -f "/etc/apt/sources.list.d/pve-enterprise.list"; then
  rm /etc/apt/sources.list.d/pve-enterprise.list
fi

echo ""
echo "The upgrade process has finished. In order to apply the upgrades are restart is required. Reboot now? [y/n](Default: n)"
echo ""

read acceptReboot

if [ "$acceptReboot" != "y" ] && [ "$acceptReboot" != "Y" ]; then
        exit;
fi

reboot
