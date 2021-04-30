﻿using System;
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
                           TypeOfBill = Convert.ToInt32(b.TypeOfBill)
                       };
            return View(list);
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
            ViewBag.lstPro1 = "Hello";
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
        public ActionResult DetailsBill()
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
            var pro = db.Products.First(p => p.Id == id);
            return View(pro);
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