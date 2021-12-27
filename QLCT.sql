
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
/****** Object:  Table [dbo].[Customer]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[Department]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[DetailsBill]    Script Date: 5/5/2021 12:06:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetailsBill](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdBill] [int] NULL,
	[IdProduct] [int] NULL,
	[Number] [bigint] NULL,
 CONSTRAINT [PK_DetailsBill] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Guarantee]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[Notify]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[NotifyType]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[Product]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[Supplier]    Script Date: 5/5/2021 12:06:45 AM ******/
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
/****** Object:  Table [dbo].[User]    Script Date: 5/5/2021 12:06:45 AM ******/
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

INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (1, N'HĐ Mua ', 7, 1, N'BaoCao_TKCSDL.pdf', CAST(N'2019-01-01' AS Date), 0, 1, NULL, 0, NULL, 171.0000, NULL, NULL, NULL)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (2, N'HĐ Bán', 1, 2, N'the1.text', CAST(N'2019-01-02' AS Date), 0, 1, NULL, 1, NULL, 0.0000, NULL, NULL, NULL)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (3, N'HĐ Mua hàng 01', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (4, N'HĐ Mua hàng 02', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (5, N'HĐ Mua hàng 03', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (7, N'HĐ Mua hàng 05', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (8, N'HĐ Mua hàng 04', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 10000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (9, N'HĐ Mua hàng 06', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, NULL, 10000.0000, 1, 50000.0000)
INSERT [dbo].[Bill] ([Id], [NameBill], [IdUser], [IdCustormer], [UrlBill], [Date], [IsDelete], [Status], [AddDelivery], [TypeOfBill], [IdStaffGuarantee], [Totalpay], [Deposit], [TypeOfDebt], [Debt]) VALUES (10, N'HĐ Mua hàng 07', 7, 1, NULL, CAST(N'2021-04-30' AS Date), 0, 0, N'Hà Nội', 0, NULL, 100.0000, 10000.0000, 1, 10000.0000)
SET IDENTITY_INSERT [dbo].[Bill] OFF
GO
SET IDENTITY_INSERT [dbo].[Customer] ON 

INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (1, 7, N'Nga', N'0344039457', N'Ha Noi', 1000.0000, CAST(N'2018-02-10' AS Date), N'5368927', N'3209220032072', N'Agribank', N'HN', 0, 0, 2)
INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (2, 7, N'The', N'123', N'HN', 0.0000, CAST(N'2017-03-03' AS Date), N'123124', N'21312312', N'tpbank', N'hn', 0, 2, 1)
INSERT [dbo].[Customer] ([Id], [IdStaff], [Name], [Phone], [Address], [Debt], [StartDate], [TIN], [BankNumber], [BankName], [BankAddress], [IsDeleted], [Status], [TypeOfDebt]) VALUES (3, 7, N'KH01', N'123', N'HN', 0.0000, CAST(N'2021-04-04' AS Date), N'12312456', N'21312312', N'tpbank', N'hn', 0, 1, 1)