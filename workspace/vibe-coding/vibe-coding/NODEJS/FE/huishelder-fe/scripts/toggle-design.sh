#!/bin/bash

# Script to toggle between old and new HuisHelder UI design

# Function to show script usage
show_usage() {
  echo "HuisHelder UI Toggle Script"
  echo ""
  echo "Usage: ./toggle-design.sh [option]"
  echo "Options:"
  echo "  --new      Enable the new design system (default)"
  echo "  --old      Switch back to the original design"
  echo "  --status   Show current design mode"
  echo "  --help     Show this help message"
  echo ""
}

# Function to update the environment file
update_env_file() {
  local design_mode=$1
  local env_file=".env.development"
  
  # Check if the VITE_USE_REDESIGNED line exists
  if grep -q "VITE_USE_REDESIGNED" "$env_file"; then
    # Update existing line
    sed -i '' "s/VITE_USE_REDESIGNED=.*/VITE_USE_REDESIGNED=$design_mode/" "$env_file"
  else
    # Add new line
    echo "VITE_USE_REDESIGNED=$design_mode" >> "$env_file"
  fi
}

# Function to get current design mode
get_current_mode() {
  local env_file=".env.development"
  if grep -q "VITE_USE_REDESIGNED=true" "$env_file"; then
    echo "Current UI Design: NEW DESIGN"
  else
    echo "Current UI Design: ORIGINAL DESIGN"
  fi
}

# Process command line arguments
case "$1" in
  --new)
    echo "Switching to the new HuisHelder design..."
    update_env_file "true"
    echo "Done! Restart the development server to see changes."
    ;;
  --old)
    echo "Switching to the original HuisHelder design..."
    update_env_file "false"
    echo "Done! Restart the development server to see changes."
    ;;
  --status)
    get_current_mode
    ;;
  --help)
    show_usage
    ;;
  *)
    # Default action
    show_usage
    get_current_mode
    echo ""
    echo "You can also use URL parameters to switch designs:"
    echo "- Add ?design=new to any URL for the new design" 
    echo "- Add ?design=old to any URL for the original design"
    echo ""
    echo "Example: http://localhost:3000/?design=new"
    echo ""
    echo "Run with --help for more information."
    ;;
esac
