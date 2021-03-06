CREATE DATABASE [QLCT195]
USE [QLCT195]
GO
/****** Object:  User [QLCT]    Script Date: 5/17/2021 10:29:20 PM ******/
CREATE USER [QLCT] FOR LOGIN [QLCT] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[Bill]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bill](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NameBill] [nvarchar](50) NULL,
	[IdUser] [int] NULL,
	[IdCustormer] [int] NULL,
	[UrlBill] [nvarchar](max) NULL,
	[Date] [date] NULL,
	[IsDelete] [bit] NULL,
	[Status] [int] NULL,
	[AddDelivery] [nvarchar](max) NULL,
	[TypeOfBill] [int] NULL,
	[IdStaffGuarantee] [int] NULL,
	[Totalpay] [money] NULL,
	[Deposit] [money] NULL,
	[TypeOfDebt] [int] NULL,
	[Debt] [money] NULL,
 CONSTRAINT [PK_Bills] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdStaff] [int] NULL,
	[Name] [nvarchar](50) NULL,
	[Phone] [nvarchar](20) NULL,
	[Address] [nvarchar](max) NULL,
	[Debt] [money] NULL,
	[StartDate] [date] NOT NULL,
	[TIN] [nvarchar](max) NULL,
	[BankNumber] [nvarchar](max) NULL,
	[BankName] [nvarchar](max) NULL,
	[BankAddress] [nvarchar](max) NULL,
	[IsDeleted] [bit] NULL,
	[Status] [int] NULL,
	[TypeOfDebt] [int] NULL,
 CONSTRAINT [PK_Custormer] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Department]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[NumberStaff] [int] NULL,
	[IdHeader] [int] NULL,
	[IsDeleted] [bit] NULL,
 CONSTRAINT [PK_Departerment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DetailsBill]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetailsBill](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdBill] [int] NULL,
	[IdProduct] [int] NULL,
	[Number] [bigint] NOT NULL,
 CONSTRAINT [PK_DetailsBill_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Guarantee]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Guarantee](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdDetailsBill] [int] NULL,
	[IdStaff] [int] NULL,
	[UrlGuarantee] [nvarchar](200) NULL,
	[Note] [nvarchar](300) NULL,
	[Status] [bit] NULL,
 CONSTRAINT [PK_Guarantee] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notify]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notify](
	[Id] [int] NOT NULL,
	[TypeId] [int] NULL,
	[Decription] [nvarchar](max) NULL,
	[CreateByID] [int] NULL,
	[DateCreate] [datetime] NULL,
	[DateTake] [datetime] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_Notify] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NotifyType]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NotifyType](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_Table_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NULL,
	[NumberRemain] [bigint] NULL,
	[Description] [nvarchar](max) NULL,
	[Price] [money] NULL,
	[Discount] [int] NULL,
	[Unit] [nvarchar](50) NULL,
	[MonthOfGuarantee] [int] NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Supplier]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supplier](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdStaff] [int] NULL,
	[Name] [nvarchar](50) NULL,
	[Phone] [nvarchar](20) NULL,
	[Address] [nvarchar](max) NULL,
	[Debt] [money] NULL,
	[TIN] [nvarchar](max) NULL,
	[BankNumber] [nvarchar](max) NULL,
	[BankName] [nvarchar](max) NULL,
	[BankAddress] [nvarchar](max) NULL,
	[IsDeleted] [bit] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_Supplier] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](50) NULL,
	[PassWord] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Sex] [bit] NULL,
	[Phone] [nvarchar](20) NOT NULL,
	[NumberSup] [bigint] NULL,
	[IdDepartment] [int] NOT NULL,
	[NumberCus] [bigint] NOT NULL,
	[Status] [int] NOT NULL,
	[IsDeleted] [bit] NULL,
 CONSTRAINT [PK_Staff] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Bill] ON 

INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (1, N'HĐ Mua ', 7, 1, N'BaoCao_TKCSDL.pdf', CAST(N'2019-01-01' AS Date), 0, 1, NULL, 0, NULL, 121.0000, NULL, NULL, NULL)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (2, N'HĐ Bán', 1, 2, N'the1.text', CAST(N'2019-01-02' AS Date), 0, 1, NULL, 1, NULL, 0.0000, NULL, NULL, NULL)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (3, N'HĐ Mua hàng 01', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (4, N'HĐ Mua hàng 02', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (5, N'HĐ Mua hàng 03', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (7, N'HĐ Mua hàng 05', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (8, N'HĐ Mua hàng 04', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (9, N'HĐ Mua hàng 06', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (10, N'HĐ Mua hàng 07', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, 0.0000, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (11, N'HĐ Mua hàng 20', 7, 1, NULL, CAST(N'2021-05-17' AS Date), 0, 0, N'Hà Nội', 0, NULL, 0.0000, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (12, N'HĐ Mua hàng 21', 7, 1, NULL, CAST(N'2021-05-17' AS Date), 0, 0, N'Hà Nội', 0, NULL, 100000.0000, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (13, N'HĐ Mua hàng 24', 7, 1, NULL, CAST(N'2021-05-17' AS Date), 0, 0, N'Hà Nội', 0, NULL, 0.0000, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (14, N'HĐ Mua hàng 26', 7, 1, NULL, CAST(N'2021-05-17' AS Date), 0, 0, N'Hà Nội', 0, NULL, 100.0000, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (15, N'HĐ Mua hàng 27', 7, 1, NULL, CAST(N'2021-05-17' AS Date), 0, 0, N'Hà Nội', 0, NULL, 100100.0000, 10000.0000, 1, 10000.0000)
SET IDENTITY_INSERT [dbo].[Bill] OFF
GO
SET IDENTITY_INSERT [dbo].[Customer] ON 

INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (1, 7, N'Nga', N'0344039457', N'Ha Noi', 1000.0000, CAST(N'2018-02-10' AS Date), N'5368927', N'3209220032072', N'Agribank', N'HN', 0, 0, 2)
INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (2, 7, N'The', N'123', N'HN', 0.0000, CAST(N'2017-03-03' AS Date), N'123124', N'21312312', N'tpbank', N'hn', 0, 2, 1)
INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (3, 7, N'KH01', N'123', N'HN', 0.0000, CAST(N'2021-04-04' AS Date), N'12312456', N'21312312', N'tpbank', N'hn', 0, 1, 1)
INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (4, 7, N'kh01', N'123', N'HN', 0.0000, CAST(N'2021-04-04' AS Date), N'12312445', N'21312312', N'tpbank', N'hn', 0, 2, 0)
SET IDENTITY_INSERT [dbo].[Customer] OFF
GO
SET IDENTITY_INSERT [dbo].[Department] ON 

INSERT [dbo].[Department] ([Id], [Name], [NumberStaff], [IdHeader], [IsDeleted]) VALUES (1, N'Phòng Giám Đốc', 1, 1, 0)
INSERT [dbo].[Department] ([Id], [Name], [NumberStaff], [IdHeader], [IsDeleted]) VALUES (2, N'Phòng Nhân Sự', 2, 3, 0)
INSERT [dbo].[Department] ([Id], [Name], [NumberStaff], [IdHeader], [IsDeleted]) VALUES (3, N'Phòng Kinh Doanh', 3, 5, 0)
INSERT [dbo].[Department] ([Id], [Name], [NumberStaff], [IdHeader], [IsDeleted]) VALUES (4, N'P KT', 0, 3, 0)
INSERT [dbo].[Department] ([Id], [Name], [NumberStaff], [IdHeader], [IsDeleted]) VALUES (5, N'P KT1', 0, 3, 0)
SET IDENTITY_INSERT [dbo].[Department] OFF
GO
SET IDENTITY_INSERT [dbo].[DetailsBill] ON 

INSERT [dbo].[DetailsBill] ([Id], [IdBill], [IdProduct], [Number]) VALUES (1, 12, 2, 10)
INSERT [dbo].[DetailsBill] ([Id], [IdBill], [IdProduct], [Number]) VALUES (2, 14, 1, 10)
INSERT [dbo].[DetailsBill] ([Id], [IdBill], [IdProduct], [Number]) VALUES (3, 15, 1, 10)
INSERT [dbo].[DetailsBill] ([Id], [IdBill], [IdProduct], [Number]) VALUES (4, 15, 2, 10)
SET IDENTITY_INSERT [dbo].[DetailsBill] OFF
GO
SET IDENTITY_INSERT [dbo].[Guarantee] ON 

INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (1, 1, 7, N'BaoCao_TKCSDL.pdf', NULL, NULL)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (2, 0, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (3, 2, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (4, 3, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (5, 1, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (6, 2, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (7, 3, NULL, NULL, NULL, 1)
INSERT [dbo].[Guarantee] ([Id], [IdDetailsBill], [IdStaff], [UrlGuarantee], [Note], [Status]) VALUES (8, 4, NULL, NULL, NULL, 1)
SET IDENTITY_INSERT [dbo].[Guarantee] OFF
GO
SET IDENTITY_INSERT [dbo].[Product] ON 

INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (1, N'1Máy chiếu to', 100, N'Máy chiếu đẹp loại to', 100.0000, 10, N'c', 6)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (2, N'Máy chiếu nhỏ', 101, N'Máy chiếu nhỏ đẹp', 100000.0000, 10, N'c', 12)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (9, N'sp1', 10, N'10', 10.0000, 10, N'c', 6)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (10, N'sp1', 10, N'10', 10.0000, 10, N'c', 4)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (11, N'sp1', 10, N'10', 10.0000, 10, N'c', 5)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (13, N'sp1', 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (17, N'Máy chiếu cao cấp', 10, N'HIII', 1000.0000, 10, N'cá', 6)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (19, N'Máy chiếu cao cấp 1', 10, N'10', 10.0000, 10, N'cái', 12)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (20, N'', 0, NULL, 0.0000, 0, NULL, 0)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (21, N'hihi', 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (22, NULL, 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (23, NULL, 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (24, NULL, 10, N'10', 10.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (25, NULL, 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (26, NULL, 10, N'10', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (27, NULL, 10, N'10', 10.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (28, NULL, 10, N'10', 10.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (29, NULL, 10, N'10', 1000.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (30, NULL, 10, N'10', 1000.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (31, NULL, 10, N'10', 1000.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (32, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (33, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (34, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (35, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (36, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (37, NULL, 10, N'1', 10.0000, 10, N'c', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (38, NULL, 10, N'10', 10.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (39, NULL, 10, N'hihi', 10.0000, 10, N'cái', 1)
INSERT [dbo].[Product] ([Id], [Name], [NumberRemain], [Description], [Price], [Discount], [Unit], [MonthOfGuarantee]) VALUES (40, NULL, 10, N'10', 1000.0000, 10, N'c', 1)
SET IDENTITY_INSERT [dbo].[Product] OFF
GO
SET IDENTITY_INSERT [dbo].[Supplier] ON 

INSERT [dbo].[Supplier] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status]) VALUES (14, 7, N'CT A', N'123', N'HN', 10000.0000, N'123124', N'21312312', N'tpbank', N'hn', 0, 1)
INSERT [dbo].[Supplier] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status]) VALUES (15, 1, N'CT A', N'123', N'HN', 10000.0000, N'123124', N'21312312', N'tpbank', N'hn', 0, 1)
INSERT [dbo].[Supplier] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status]) VALUES (16, 5, N'CT D', N'123', N'HN', 10000.0000, N'123124', N'21312312', N'tpbank', N'hn', 1, 1)
SET IDENTITY_INSERT [dbo].[Supplier] OFF
GO
SET IDENTITY_INSERT [dbo].[User] ON 

INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (0, N'AllUser', N'123', N'sp2', 0, N'123', 1, 1, 0, 0, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (1, N'theGD@gmail.com', N'123', N'The GD', 0, N'1234', 5, 1, 0, 1, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (2, N'thePGD@gmail.com', N'123', N'The PGD', 0, N'123', 5, 1, 0, 0, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (3, N'theNSL@gmail.com', N'123', N'TheNSL', 1, N'3', 0, 2, 0, 1, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (5, N'theNS@gmail.com', N'123', N'The NS', 0, N'123', 2, 2, 0, 0, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (7, N'theKDL@gmail.com', N'123', N'TheKDL', 0, N'123', -1, 3, 2, 1, 0)
INSERT [dbo].[User] ([Id], [UserName], [PassWord], [Name], [Sex], [Phone], [NumberSup], [IdDepartment], [NumberCus], [Status], [IsDeleted]) VALUES (8, N'theKD@gmail.com', N'123', N'TheKD', 0, N'6', 0, 3, 0, 0, 0)
SET IDENTITY_INSERT [dbo].[User] OFF
GO
ALTER TABLE [dbo].[Bill]  WITH CHECK ADD  CONSTRAINT [FK_Bills_Custormer] FOREIGN KEY([IdCustormer])
REFERENCES [dbo].[Customer] ([Id])
GO
ALTER TABLE [dbo].[Bill] CHECK CONSTRAINT [FK_Bills_Custormer]
GO
ALTER TABLE [dbo].[Bill]  WITH CHECK ADD  CONSTRAINT [FK_Bills_User] FOREIGN KEY([IdUser])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Bill] CHECK CONSTRAINT [FK_Bills_User]
GO
ALTER TABLE [dbo].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Custormer_User] FOREIGN KEY([IdStaff])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Customer] CHECK CONSTRAINT [FK_Custormer_User]
GO
ALTER TABLE [dbo].[Department]  WITH CHECK ADD  CONSTRAINT [FK_Departerment_Staff] FOREIGN KEY([IdHeader])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Department] CHECK CONSTRAINT [FK_Departerment_Staff]
GO
ALTER TABLE [dbo].[DetailsBill]  WITH CHECK ADD  CONSTRAINT [FK_DetailsBill_Bill] FOREIGN KEY([IdBill])
REFERENCES [dbo].[Bill] ([Id])
GO
ALTER TABLE [dbo].[DetailsBill] CHECK CONSTRAINT [FK_DetailsBill_Bill]
GO
ALTER TABLE [dbo].[DetailsBill]  WITH CHECK ADD  CONSTRAINT [FK_DetailsBill_Product] FOREIGN KEY([IdProduct])
REFERENCES [dbo].[Product] ([Id])
GO
ALTER TABLE [dbo].[DetailsBill] CHECK CONSTRAINT [FK_DetailsBill_Product]
GO
ALTER TABLE [dbo].[Guarantee]  WITH CHECK ADD  CONSTRAINT [FK_Guarantee_User] FOREIGN KEY([IdStaff])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Guarantee] CHECK CONSTRAINT [FK_Guarantee_User]
GO
ALTER TABLE [dbo].[Notify]  WITH CHECK ADD  CONSTRAINT [FK_Notify_NotifyType] FOREIGN KEY([TypeId])
REFERENCES [dbo].[NotifyType] ([Id])
GO
ALTER TABLE [dbo].[Notify] CHECK CONSTRAINT [FK_Notify_NotifyType]
GO
ALTER TABLE [dbo].[Supplier]  WITH CHECK ADD  CONSTRAINT [FK_Supplier_User] FOREIGN KEY([IdStaff])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_User]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_Staff_Departerment] FOREIGN KEY([IdDepartment])
REFERENCES [dbo].[Department] ([Id])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_Staff_Departerment]
GO
/****** Object:  Trigger [dbo].[trg_Guarantee_CREATE]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[trg_Guarantee_CREATE]
   ON  [dbo].[DetailsBill] 
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	 DECLARE @IdDetailsBill int
	 SET @IdDetailsBill = (SELECT Id FROM inserted )
	 DECLARE @IdStaffGuarantee int
	 SET @IdStaffGuarantee = (SELECT b.IdStaffGuarantee FROM inserted ins INNER JOIN Bill b ON ins.IdBill = b.Id )
	 INSERT INTO Guarantee ([IdDetailsBill],[Status]) VALUES 
	 ( @IdDetailsBill, 1)

    -- Insert statements for trigger here

END
GO
ALTER TABLE [dbo].[DetailsBill] ENABLE TRIGGER [trg_Guarantee_CREATE]
GO
/****** Object:  Trigger [dbo].[trg_Total_Bill_CREATE]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[trg_Total_Bill_CREATE]
   ON  [dbo].[DetailsBill] 
   AFTER INSERT
AS 
BEGIN
	UPDATE Bill SET Totalpay = Totalpay + (
		SELECT p.Price*p.Discount/100*ins.Number
		FROM inserted ins 
		INNER JOIN Product p ON ins.IdProduct = p.Id
		)
	FROM Bill 
	JOIN inserted ON Bill.Id = inserted.IdBill

END
GO
ALTER TABLE [dbo].[DetailsBill] ENABLE TRIGGER [trg_Total_Bill_CREATE]
GO
/****** Object:  Trigger [dbo].[trg_Total_Bill_DELETE]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[trg_Total_Bill_DELETE]
   ON  [dbo].[DetailsBill] 
   FOR DELETE
AS 
BEGIN
	UPDATE Bill SET Totalpay = Totalpay - (
		SELECT p.Price*p.Discount/100*dele.Number
		FROM deleted dele 
		INNER JOIN Product p ON dele.IdProduct = p.Id
		)
	FROM Bill 
	JOIN deleted ON Bill.Id = deleted.IdBill

END
GO
ALTER TABLE [dbo].[DetailsBill] ENABLE TRIGGER [trg_Total_Bill_DELETE]
GO
/****** Object:  Trigger [dbo].[trg_Total_Bill_UPDATE]    Script Date: 5/17/2021 10:29:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[trg_Total_Bill_UPDATE]
   ON  [dbo].[DetailsBill] 
   AFTER UPDATE
AS 
BEGIN
	UPDATE Bill SET Totalpay = Totalpay - (
		SELECT p.Price*p.Discount/100*dele.Number
		FROM deleted dele 
		INNER JOIN Product p ON dele.IdProduct = p.Id
		) + (
		SELECT p.Price*p.Discount/100*ins.Number
		FROM inserted ins 
		INNER JOIN Product p ON ins.IdProduct = p.Id
		)
	FROM Bill 
	JOIN deleted ON Bill.Id = deleted.IdBill

END
GO
ALTER TABLE [dbo].[DetailsBill] ENABLE TRIGGER [trg_Total_Bill_UPDATE]
GO
