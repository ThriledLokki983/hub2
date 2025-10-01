import { App } from './app';
import AuthRoute from './routes/auth.route';
import RecipeRoute from './routes/recipe.route';

const app = new App([new AuthRoute(), new RecipeRoute()]);
app.start();
// const app = express();
