import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { BuyersModule } from './buyers/buyers.module';
import { CategoriesModule } from './categories/categories.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { ShippingsModule } from './shippings/shippings.module';
import { TaxesModule } from './taxes/taxes.module';
import { TagsModule } from './tags/tags.module';
import { ShopsModule } from './shops/shops.module';
import { TypesModule } from './catalogs/catalogs.module';
import { WithdrawsModule } from './withdraws/withdraws.module';
import { UploadsModule } from './uploads/uploads.module';
import { SettingsModule } from './settings/settings.module';
import { CouponsModule } from './coupons/coupons.module';
import { AddressesModule } from './addresses/addresses.module';
import { ImportsModule } from './imports/imports.module';
import { AuthModule } from './auth/auth.module';
import { RefundsModule } from './refunds/refunds.module';
import { AuthorsModule } from './authors/authors.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { CustomerModule } from './customer/customer.module';
import { AuthGuard } from './auth/auth.guard';
// import { AiChat } from 'aichat/aichat.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, 'docs'),
    //   exclude: ['/api*'],
    // }),
    CustomerModule,
    UsersModule,
    CommonModule,
    BuyersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    AnalyticsModule,
    AttributesModule,
    ShippingsModule,
    TaxesModule,
    TagsModule,
    ShopsModule,
    TypesModule,
    WithdrawsModule,
    UploadsModule,
    SettingsModule,
    CouponsModule,
    AddressesModule,
    ImportsModule,
    AuthModule,
    RefundsModule,
    AuthorsModule,
    ManufacturersModule,
    NewslettersModule
    // AiChat,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
