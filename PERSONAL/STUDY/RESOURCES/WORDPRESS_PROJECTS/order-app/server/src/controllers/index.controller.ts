import { Controller, Get, UseBefore } from 'routing-controllers';
import { protect } from '@middlewares/auth.middleware';

@Controller()
export class IndexController {

    @Get('/')
    @UseBefore(protect)
    index() {
        return { data: "okay", message: "Success"}
    }
}

export default IndexController;
