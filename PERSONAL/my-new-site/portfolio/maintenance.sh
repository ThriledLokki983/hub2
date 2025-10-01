#!/bin/bash

# Maintenance Mode Utility Script
# This script helps you quickly enable or disable maintenance mode

MAINTENANCE_FILE="maintenance.html"
INDEX_FILE="index.html"
INDEX_BACKUP="index.backup.html"

case "$1" in
  "enable"|"on")
    if [ -f "$INDEX_FILE" ]; then
      echo "🚧 Enabling maintenance mode..."
      
      # Backup the current index.html
      cp "$INDEX_FILE" "$INDEX_BACKUP"
      
      # Replace index.html with maintenance.html
      cp "$MAINTENANCE_FILE" "$INDEX_FILE"
      
      echo "✅ Maintenance mode enabled!"
      echo "📝 Original index.html backed up as $INDEX_BACKUP"
      echo "🌐 Your site now shows the maintenance page"
    else
      echo "❌ Error: $INDEX_FILE not found"
      exit 1
    fi
    ;;
    
  "disable"|"off")
    if [ -f "$INDEX_BACKUP" ]; then
      echo "🔄 Disabling maintenance mode..."
      
      # Restore the original index.html
      cp "$INDEX_BACKUP" "$INDEX_FILE"
      
      # Remove the backup
      rm "$INDEX_BACKUP"
      
      echo "✅ Maintenance mode disabled!"
      echo "🌐 Your original site is now live"
    else
      echo "❌ Error: No backup found ($INDEX_BACKUP)"
      echo "💡 Maintenance mode might not be enabled or backup was removed"
      exit 1
    fi
    ;;
    
  "status")
    if [ -f "$INDEX_BACKUP" ]; then
      echo "🚧 Maintenance mode is currently ENABLED"
      echo "📁 Backup file exists: $INDEX_BACKUP"
    else
      echo "✅ Maintenance mode is currently DISABLED"
      echo "🌐 Normal site is live"
    fi
    ;;
    
  *)
    echo "🛠️  Maintenance Mode Utility"
    echo ""
    echo "Usage: $0 [enable|disable|status]"
    echo ""
    echo "Commands:"
    echo "  enable  (or on)   - Enable maintenance mode"
    echo "  disable (or off)  - Disable maintenance mode"
    echo "  status           - Check current maintenance status"
    echo ""
    echo "Examples:"
    echo "  $0 enable     # Turn on maintenance mode"
    echo "  $0 disable   # Turn off maintenance mode"
    echo "  $0 status     # Check if maintenance is active"
    ;;
esac
