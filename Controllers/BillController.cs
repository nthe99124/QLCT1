using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;
using Newtonsoft.Json;

namespace QLCT.Controllers
{
    public class BillController : Controller
    {
        // GET: Bill
        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult IndexBuy()
        {
            var uid = Session["user"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.TypeOfBill == 0
                       where b.IsDelete == false
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill)
                       };
            
            return View(list);
        }
        public ActionResult IndexSell()
        {
            var uid = Session["user"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.TypeOfBill == 0
                       where b.IsDelete == false
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill)
                       };

            return View(list);
        }
        public JsonResult Ajax_Debt_Status_Buy(int debt,int status)
        {
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.TypeOfBill == 0
                       where b.IsDelete == false
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill),
                           TypeOfDebt = Convert.ToInt32(b.TypeOfDebt),
                           Status = b.Status
                       };
            // status = 7  - debt = 3 - search full
            if (status == 7)
            {
                if (debt == 0)
                {
                    list = list.Where(l => l.TypeOfDebt == 0).Select(l => l);
                }
                else if (debt == 1)
                {
                    list = list.Where(l => l.TypeOfDebt == 1).Select(l => l);
                }
                else
                {
                    list = list.Where(l => l.TypeOfDebt == 1 || l.TypeOfDebt == 0).Select(l => l);
                }
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                if (debt == 0)
                {
                    list = list.Where(l => l.TypeOfDebt == 0).Select(l => l);
                }
                else if (debt == 1)
                {
                    list = list.Where(l => l.TypeOfDebt == 1).Select(l => l);
                }
                else
                {
                    list = list.Where(l => l.TypeOfDebt == 1 || l.TypeOfDebt == 0).Select(l => l);
                }
                switch (status)
                {
                    case 0: list = list.Where(l => l.Status == 0).Select(l => l); break;
                    case 1: list = list.Where(l => l.Status == 1).Select(l => l); break;
                    case 2: list = list.Where(l => l.Status == 2).Select(l => l); break;
                    case 3: list = list.Where(l => l.Status == 3).Select(l => l); break;
                    case 4: list = list.Where(l => l.Status == 4).Select(l => l); break;
                    case 5: list = list.Where(l => l.Status == 5).Select(l => l); break;
                    case 6: list = list.Where(l => l.Status == 6).Select(l => l); break;
                }
                return Json(list, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult Ajax_Status_Buy(int status)
        {
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.TypeOfBill == 0
                       where b.IsDelete == false
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill),
                           TypeOfDebt = Convert.ToInt32(b.TypeOfDebt),
                           Status = b.Status
                       };
            switch (status)
            {
                case 0 : list = list.Where(l => l.Status == 0).Select(l => l);break;
                case 1 : list = list.Where(l => l.Status == 1).Select(l => l);break;
                case 2 : list = list.Where(l => l.Status == 2).Select(l => l);break;
                case 3 : list = list.Where(l => l.Status == 3).Select(l => l);break;
                case 4 : list = list.Where(l => l.Status == 4).Select(l => l);break;
                case 5 : list = list.Where(l => l.Status == 5).Select(l => l);break;
                case 6 : list = list.Where(l => l.Status == 6).Select(l => l);break;
                case 7 : list = list.Select(l => l);break;
            }
            return Json(list,JsonRequestBehavior.AllowGet);
        }
        public JsonResult Ajax_Debt_Sell(int debt)
        {
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.TypeOfBill == 1
                       where b.IsDelete == false
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill),
                           TypeOfDebt = Convert.ToInt32(b.TypeOfDebt)
                       };
            if (debt == 0)
            {
                list = list.Where(l => l.TypeOfDebt == 0).Select(l => l);
            }
            else if (debt == 1)
            {
                list = list.Where(l => l.TypeOfDebt == 1).Select(l => l);
            }
            else
            {
                list = list.Where(l => l.TypeOfDebt == 1 || l.TypeOfDebt == 0).Select(l => l);
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public ActionResult ShowBill(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var bill = db.Bills.First(b => b.Id == id);
            ViewBag.UrlBill = bill.UrlBill;
            return View();
        }
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            ViewBag.lstCus = db.Customers.Select(c => c);
            ViewBag.lstUser = db.Users.Select(c => c).Where(c=>c.IdDepartment == 3 && c.IsDeleted == false);
            ViewBag.lstPro = db.Products.Select(p => p);
            return View();
        }
        [HttpPost]
        public ActionResult Insert(Bill bill,DetailsBill debill)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            Bill checkbill = db.Bills.Where(b => b.NameBill == Request["NameBill"]).FirstOrDefault();
            if (checkbill != null)
            {
                ViewBag.check = "Hợp đồng này đã tồn tại!";
                return RedirectToAction("Index", "Bill");
            }
            else
            {
                
                bill.NameBill = Request["NameBill"];
                bill.IdUser = Convert.ToInt32(Request["IdUser"]);
                bill.IdCustormer = Convert.ToInt32(Request["IdCustormer"]);
                bill.Date = DateTime.Now;
                bill.IsDelete = false;
                bill.Status = 0;
                bill.AddDelivery = Request["AddDelivery"];
                bill.Totalpay = 0;
                bill.TypeOfBill = Convert.ToInt32(Request["TypeOfBill"]);
                bill.TypeOfDebt = Convert.ToInt32(Request["TypeOfDebt"]);
                bill.Deposit = decimal.Parse(Request["Deposit"]);
                bill.Debt = decimal.Parse(Request["Debt"]);
                db.Bills.InsertOnSubmit(bill);
                db.SubmitChanges();
                List<int> getid = db.Bills.Where(b => b.NameBill == bill.NameBill && b.IdUser == bill.IdUser && b.IdCustormer == bill.IdCustormer &&
                b.Date == bill.Date && b.IsDelete == false && bill.Status == 0 && b.AddDelivery == bill.AddDelivery
                && b.TypeOfBill == bill.TypeOfBill && b.TypeOfDebt == bill.TypeOfDebt && b.Deposit == bill.Deposit && b.Debt == bill.Debt).Select(b => b.Id).ToList();
                var index = Convert.ToInt32(Request["hiddenIndex"]);
                for (int i = 0; i < index; i++)
                {
                    debill.IdBill = getid[0];
                    var IdPro = String.Format("IdPro{0}",i+1);
                    var Number = String.Format("Number{0}", i+1);
                    debill.IdProduct = Convert.ToInt32(Request[IdPro]);
                    debill.Number = Convert.ToInt32(Request[Number]);
                    db.DetailsBills.InsertOnSubmit(debill);
                }
                db.SubmitChanges();
            }
            return this.Insert();
        }
        public ActionResult DetailsBill(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            ViewBag.lstCus = db.Customers.Select(c => c);
            var bill = db.Bills.First(b => b.Id == id);
            ViewBag.UrlBill = bill.UrlBill;
            return View();
        }
        // Update
        public ActionResult Update(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            ViewBag.lstCus = db.Customers.Select(c => c);
            ViewBag.lstUser = db.Users.Select(c => c).Where(c => c.IdDepartment == 3 && c.IsDeleted == false);
            ViewBag.lstPro = db.Products.Select(p => p);
            var list = (from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.Id equals de.IdBill
                       where b.IsDelete == false
                       where b.Id == id
                       select new User_DetailsBill_Cus_Bill_Product
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill),
                           TypeOfDebt = Convert.ToInt32(b.TypeOfDebt),
                           Status = b.Status,
                           IdCustormer = b.IdCustormer,
                           Deposit = b.Deposit,
                           Debt = b.Debt,
                           AddDelivery = b.AddDelivery
                       });
            return View(list);
        }
        [HttpPost]
        public ActionResult Update(int id, Product pro)
        {
            if (Session["user"] == null)
            {
                return  RedirectToAction("Index", "Log");
            }
            pro = db.Products.Where(c => c.Id == id).SingleOrDefault();
            pro.Name = Request["Name"];
            pro.NumberRemain = Convert.ToInt32(Request["NumberRemain"]);
            pro.Description = Request["Description"];
            pro.Price = Convert.ToInt32(Request["Price"]);
            pro.Discount = Convert.ToInt32(Request["Discount"]);
            pro.Unit = Request["Unit"];
            UpdateModel(pro);
            db.SubmitChanges();
            return RedirectToAction("Index", "Product");
        }
        // Delete -- Not Update IsDelete
        public ActionResult Delete(int id, Product pro)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            pro = db.Products.Where(c => c.Id == id).SingleOrDefault();
            db.Products.DeleteOnSubmit(pro);
            db.SubmitChanges();
            return RedirectToAction("Index", "Product");
        }
    }
}