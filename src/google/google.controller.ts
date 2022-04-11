import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { GoogleService } from "./google.service";

@Controller("google")
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @ApiOperation({ summary: "Google authentication" })
  @ApiResponse({ status: 200, description: "Successfully" })
  @Get("/login")
  @UseGuards(AuthGuard("google"))
  googleAuth() {return 'ok'}

  @ApiOperation({ summary: "Registration user" })
  @ApiResponse({ status: 200, description: "Successfully" })
  @Get("/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.googleService.googleLogin(req);
  }

  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "Successfully" })
  @Get("/logout")
  googleLogOut(@Res() res) {
    res.setHeader("Set-Cookie", this.googleService.getCookieForLogOut());
    return res.sendStatus(200);
  }
}
