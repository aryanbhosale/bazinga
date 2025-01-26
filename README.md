
# Bazinga Setup Documentation

Welcome to the Bazinga project! This guide will help you set up and run the application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** : Version 14.x or later. [Download Node.js](https://nodejs.org/)
* **npm** : Comes bundled with Node.js. Verify installation by running:

```bash
  node -v
  npm -v
```

## Clone the Repository

Start by cloning the Bazinga repository:

```bash
git clone https://github.com/aryanbhosale/bazinga.git
cd bazinga
```

## Install Dependencies

Install the required npm packages:

```bash
npm install
```

## Environment Variables

The project requires certain environment variables. Use the provided example file to set them up:

1. Duplicate the `.env.local.example` file and rename the copy to `.env.local`.
2. Open `.env.local` and fill in the necessary values. For instance:

   ```env
   NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_api_key
   ```

   Replace `your_google_maps_api_key` with your actual Google Maps API key.

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000/).

## Project Structure

Here's an overview of the project's structure:

* **`/public`** : Contains static assets like images and icons.
* **`/src`** : Main source code directory.
* **`/app`** : Application components and pages.
* **`/components`** : Reusable React components.
* **`/utils`** : Utility functions and types.
* **Configuration Files** :
* `.env.local.example`: Template for environment variables.
* `next.config.ts`: Next.js configuration.
* `tailwind.config.ts`: Tailwind CSS configuration.
* `tsconfig.json`: TypeScript configuration.

## Key Features

* **Map Integration** : Utilizes Google Maps API to display property locations with dynamic markers that adjust size based on zoom level.
* **Property Listings** : Displays a list of properties with details like price, bedrooms, bathrooms, and square footage.
* **Drawing Tools** : Allows users to draw polygons on the map to define areas of interest.

## Customizing Markers

The application uses dynamic black circle markers that adjust in size with zoom. This is achieved using the Google Maps JavaScript API's `SymbolPath.CIRCLE`. The marker's `scale` property determines its size and can be adjusted as needed.

## Adding New Tools

To add new tools or features:

1. Create a new component in the appropriate directory (e.g., `/src/components`).
2. Follow the existing code conventions and structure.
3. Update relevant parts of the application to incorporate the new component.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and new features.

---

For any questions or support, please open an issue in the repository. Happy coding!
