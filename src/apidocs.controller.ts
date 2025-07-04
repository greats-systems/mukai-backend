@Get('/api-docs')
  @UseGuards(JwtAuthGuard)
  protected(@Req() req) {
    return {
      message: 'AuthGuard works 🎉',
      authenticated_user: req.user,
    };
  }