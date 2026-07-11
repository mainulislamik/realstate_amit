import {
  Controller, Get, Post, Res, Req, Param, Body, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { PropertiesService } from '../properties/properties.service';
import { AgentsService } from '../agents/agents.service';
import { BlogService } from '../blog/blog.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../../common/auth.guard';
import { GuestGuard } from '../../common/guest.guard';
import { multerOptions } from '../../common/upload.util';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Studio', 'Office', 'Shop', 'Single Family Home', 'Penthouse', 'Townhouse', 'Land'];
const PROPERTY_STATUSES = ['For Sale', 'For Rent', 'Sold'];

@Controller('admin')
export class AdminController {
  constructor(
    private readonly properties: PropertiesService,
    private readonly agents: AgentsService,
    private readonly blog: BlogService,
    private readonly users: UsersService,
  ) {}

  @Get('login')
  @UseGuards(GuestGuard)
  login(@Res() res: Response) {
    res.render('admin/login', { title: 'Admin Login', error: '' });
  }

  @Post('login')
  @UseGuards(GuestGuard)
  async loginPost(@Body() body: { username?: string; password?: string }, @Req() req: Request, @Res() res: Response) {
    const user = await this.users.verify(body.username || '', body.password || '');
    if (!user) {
      return res.render('admin/login', { title: 'Admin Login', error: 'Invalid username or password' });
    }
    (req.session as any).userId = user.id;
    (req.session as any).username = user.username;
    res.redirect('/admin');
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => res.redirect('/admin/login'));
  }

  @Get()
  @UseGuards(AuthGuard)
  async dashboard(@Req() req: Request, @Res() res: Response) {
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      username: (req.session as any).username,
      counts: {
        properties: (await this.properties.findAll()).length,
        agents: (await this.agents.findAll()).length,
        posts: (await this.blog.findAll()).length,
      },
    });
  }

  // ---- Properties ----
  @Get('properties')
  @UseGuards(AuthGuard)
  async propertiesList(@Res() res: Response) {
    res.render('admin/properties', {
      title: 'Manage Properties',
      properties: await this.properties.findAll(),
      types: PROPERTY_TYPES,
      statuses: PROPERTY_STATUSES,
    });
  }

  @Get('properties/new')
  @UseGuards(AuthGuard)
  newProperty(@Res() res: Response) {
    res.render('admin/property-form', { title: 'New Property', property: null, types: PROPERTY_TYPES, statuses: PROPERTY_STATUSES });
  }

  @Post('properties')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async createProperty(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    await this.properties.create({
      title: body.title,
      type: body.type,
      status: body.status,
      price: Number(body.price) || 0,
      beds: Number(body.beds) || 0,
      baths: Number(body.baths) || 0,
      sqft: Number(body.sqft) || 0,
      label: body.label || '',
      location: body.location,
      state: body.state,
      description: body.description,
      image: file ? `/uploads/${file.filename}` : body.image || '',
      featured: body.featured === 'on',
    });
    res.redirect('/admin/properties');
  }

  @Get('properties/:id/edit')
  @UseGuards(AuthGuard)
  async editProperty(@Param('id') id: string, @Res() res: Response) {
    const property = await this.properties.findById(Number(id));
    if (!property) return res.redirect('/admin/properties');
    res.render('admin/property-form', { title: 'Edit Property', property, types: PROPERTY_TYPES, statuses: PROPERTY_STATUSES });
  }

  @Post('properties/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async updateProperty(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    const data: any = {
      title: body.title,
      type: body.type,
      status: body.status,
      price: Number(body.price) || 0,
      beds: Number(body.beds) || 0,
      baths: Number(body.baths) || 0,
      sqft: Number(body.sqft) || 0,
      label: body.label || '',
      location: body.location,
      state: body.state,
      description: body.description,
      featured: body.featured === 'on',
    };
    if (file) data.image = `/uploads/${file.filename}`;
    else if (body.image) data.image = body.image;
    await this.properties.update(Number(id), data);
    res.redirect('/admin/properties');
  }

  @Post('properties/:id/delete')
  @UseGuards(AuthGuard)
  async deleteProperty(@Param('id') id: string, @Res() res: Response) {
    await this.properties.remove(Number(id));
    res.redirect('/admin/properties');
  }

  // ---- Agents ----
  @Get('agents')
  @UseGuards(AuthGuard)
  async agentsList(@Res() res: Response) {
    res.render('admin/agents', { title: 'Manage Agents', agents: await this.agents.findAll() });
  }

  @Get('agents/new')
  @UseGuards(AuthGuard)
  newAgent(@Res() res: Response) {
    res.render('admin/agent-form', { title: 'New Agent', agent: null });
  }

  @Post('agents')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async createAgent(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    await this.agents.create({
      name: body.name,
      title: body.title,
      phone: body.phone,
      phone2: body.phone2,
      whatsapp: body.whatsapp,
      email: body.email,
      bio: body.bio,
      image: file ? `/uploads/${file.filename}` : body.image || '',
      verified: body.verified === 'on',
      listings: body.listings ? String(body.listings).split(',').map(Number).filter((n: number) => !isNaN(n)) : [],
    });
    res.redirect('/admin/agents');
  }

  @Get('agents/:id/edit')
  @UseGuards(AuthGuard)
  async editAgent(@Param('id') id: string, @Res() res: Response) {
    const agent = await this.agents.findById(Number(id));
    if (!agent) return res.redirect('/admin/agents');
    res.render('admin/agent-form', { title: 'Edit Agent', agent });
  }

  @Post('agents/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async updateAgent(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    const data: any = {
      name: body.name,
      title: body.title,
      phone: body.phone,
      phone2: body.phone2,
      whatsapp: body.whatsapp,
      email: body.email,
      bio: body.bio,
      verified: body.verified === 'on',
      listings: body.listings ? String(body.listings).split(',').map(Number).filter((n: number) => !isNaN(n)) : [],
    };
    if (file) data.image = `/uploads/${file.filename}`;
    else if (body.image) data.image = body.image;
    await this.agents.update(Number(id), data);
    res.redirect('/admin/agents');
  }

  @Post('agents/:id/delete')
  @UseGuards(AuthGuard)
  async deleteAgent(@Param('id') id: string, @Res() res: Response) {
    await this.agents.remove(Number(id));
    res.redirect('/admin/agents');
  }

  // ---- Blog ----
  @Get('blog')
  @UseGuards(AuthGuard)
  async blogList(@Res() res: Response) {
    res.render('admin/blog', { title: 'Manage Blog', posts: await this.blog.findAll() });
  }

  @Get('blog/new')
  @UseGuards(AuthGuard)
  newPost(@Res() res: Response) {
    res.render('admin/blog-form', { title: 'New Post', post: null });
  }

  @Post('blog')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async createPost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    await this.blog.create({
      title: body.title,
      category: body.category,
      excerpt: body.excerpt,
      content: body.content,
      image: file ? `/uploads/${file.filename}` : body.image || '',
    });
    res.redirect('/admin/blog');
  }

  @Get('blog/:id/edit')
  @UseGuards(AuthGuard)
  async editPost(@Param('id') id: string, @Res() res: Response) {
    const post = await this.blog.findById(Number(id));
    if (!post) return res.redirect('/admin/blog');
    res.render('admin/blog-form', { title: 'Edit Post', post });
  }

  @Post('blog/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imageFile', multerOptions()))
  async updatePost(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    const data: any = {
      title: body.title,
      category: body.category,
      excerpt: body.excerpt,
      content: body.content,
    };
    if (file) data.image = `/uploads/${file.filename}`;
    else if (body.image) data.image = body.image;
    await this.blog.update(Number(id), data);
    res.redirect('/admin/blog');
  }

  @Post('blog/:id/delete')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    await this.blog.remove(Number(id));
    res.redirect('/admin/blog');
  }
}
