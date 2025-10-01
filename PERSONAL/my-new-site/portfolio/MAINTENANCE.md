# Maintenance Mode

This project includes a built-in maintenance page that follows the same design system as your portfolio.

## Features

- 🎨 **Consistent Design**: Matches your portfolio's theme system
- 🌓 **Theme Support**: Full light/dark mode support with theme cycling
- 📱 **Responsive**: Mobile-friendly design
- ♿ **Accessible**: Screen reader friendly with proper ARIA labels
- ⏰ **Dynamic Updates**: Shows expected return time
- 🎯 **Interactive**: Keyboard shortcuts and hover effects
- 📧 **Contact Info**: Easy access to your contact information

## Quick Usage

### Using the Script (Recommended)

```bash
# Enable maintenance mode
./maintenance.sh enable

# Disable maintenance mode  
./maintenance.sh disable

# Check status
./maintenance.sh status
```

### Manual Method

1. **Enable Maintenance Mode:**
   ```bash
   # Backup your current index.html
   cp index.html index.backup.html
   
   # Replace with maintenance page
   cp maintenance.html index.html
   ```

2. **Disable Maintenance Mode:**
   ```bash
   # Restore original site
   cp index.backup.html index.html
   
   # Clean up backup
   rm index.backup.html
   ```

## Customization

### Update Contact Information

Edit `maintenance.html` and update the contact section:

```html
<div class="maintenance-contact">
  <h3>Need to get in touch?</h3>
  <p>If you have any urgent inquiries, feel free to reach out:</p>
  <p>
    Email: <a href="mailto:your-email@example.com">your-email@example.com</a><br>
    LinkedIn: <a href="https://linkedin.com/in/yourprofile">Connect with me</a>
  </p>
</div>
```

### Customize Return Time

The return time is automatically calculated (2 hours from current time). To customize, edit `src/maintenance-main.ts`:

```typescript
const updateReturnTime = () => {
  const returnTimeElement = document.getElementById('return-time');
  if (!returnTimeElement) return;
  
  // Customize this logic
  const now = new Date();
  const returnTime = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // 4 hours from now
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  returnTimeElement.textContent = `Expected by ${returnTime.toLocaleTimeString('en-US', options)}`;
}
```

### Auto-Check for Site Availability

Uncomment the code at the bottom of `src/maintenance-main.ts` to enable automatic checking:

```typescript
const checkSiteAvailability = async () => {
  try {
    const response = await fetch('/', { method: 'HEAD' });
    if (response.ok) {
      window.location.href = '/';
    }
  } catch (error) {
    console.log('Site still under maintenance');
  }
}

// Check every 5 minutes
setInterval(checkSiteAvailability, 5 * 60 * 1000);
```

## Keyboard Shortcuts

- `T` - Toggle theme
- `Click maintenance icon` - Fun interaction effect

## Development

To test the maintenance page during development:

```bash
# Build the project (includes maintenance page)
yarn build

# Or start dev server and visit /maintenance.html
yarn dev
# Then go to http://localhost:3000/maintenance.html
```

## Files Structure

```
├── maintenance.html              # Main maintenance page
├── maintenance.sh               # Utility script for enabling/disabling
├── src/
│   ├── maintenance-main.ts      # Maintenance page functionality
│   └── styles/
│       └── components/
│           └── maintenance.scss # Maintenance page styles
```

## Best Practices

1. **Test First**: Always test the maintenance page before enabling it live
2. **Notify Users**: Consider sending email/social media notifications about planned maintenance
3. **Set Expectations**: Update the return time to be realistic
4. **Monitor**: Check server logs during maintenance for any issues
5. **Quick Disable**: Keep the disable command handy for quick restoration

## Integration with CI/CD

You can integrate this with your deployment pipeline:

```yaml
# Example GitHub Actions
- name: Enable Maintenance Mode
  run: ./maintenance.sh enable

- name: Deploy Updates
  run: # your deployment commands

- name: Disable Maintenance Mode  
  run: ./maintenance.sh disable
```
