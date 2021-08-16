#!/bin/bash

TARGET=/etc/apt/sources.list
BACKUP=/etc/apt/sources.d10

echo -e "This script will help automate the process to upgrade to Debian 11 from Debian 10. \e[1mYou still may be asked to choose configuration file options or settings.\e[0m"
echo ""
echo "We will start by making a backup of the apt sources file which will contain the Debian 10 repo entries incase this script fails. "
echo "The BACKUP file will be located: $BACKUP"
echo ""
echo "Once the backup has been made, we will clear and add new entries to '$TARGET' for Debian 11 and than update the cache."
echo ""
echo "We will then perform a system upgrade which may take a long time."
echo -e "\e[1m"
echo -e "This may cause a loss of data! Backup your data before running this script!\e[0m"
echo -e ""
echo "You will be asked to restart once the script finishes."
echo ""
echo "Do you wish to continue with this upgrade? [y/n](Default: n)"
echo""

read accept

if [ "$accept" != "y" ] && [ "$accept" != "Y" ]; then
        exit;
fi

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

echo "deb http://deb.debian.org/debian bullseye main contrib non-free" >> $TARGET
echo "deb http://deb.debian.org/debian bullseye-updates main contrib non-free" >> $TARGET
echo "deb http://security.debian.org/debian-security bullseye-security main" >> $TARGET
echo "deb http://ftp.debian.org/debian bullseye-backports main contrib non-free" >> $TARGET

apt-get clean
apt-get update
apt full-upgrade

echo ""
echo "The upgrade process has finished. In order to apply the upgrades are restart is required. Reboot now? [y/n](Default: n)"
echo ""

read acceptReboot

if [ "$acceptReboot" != "y" ] && [ "$acceptReboot" != "Y" ]; then
        exit;
fi

reboot
