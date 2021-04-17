using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class BillController : Controller
    {
        // GET: Bill
        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult IndexPersional()
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
                       join de in db.DetailsBills on b.IdDetails equals de.Id
                       where b.IsDelete == false
                       where b.IdUser == 7
                       select new User_DetailsBill_Cus_Bill
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date)
                       };
            return View(list);
        }
        [HttpPost]
        public ActionResult Index(int? page, FormCollection a)
        {
            var viewpro = from p in db.Products
                          where p.Name.Contains(Request["key"])
                          select p;
            return View(viewpro.ToPagedList(page ?? 1, 20));
        }
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            return View();
        }
        [HttpPost]
        public ActionResult Insert(Product pro)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            Product checkpro = db.Products.Where(p => p.Name == Request["Name"]).FirstOrDefault();
            if (checkpro != null)
            {
                ViewBag.check = "Mặt hàng này đã tồn tại!";
                return RedirectToAction("Index", "Product");
            }
            else
            {
                pro.Name = Request["Name"];
                pro.NumberRemain = Convert.ToInt32(Request["NumberRemain"]);
                pro.Description = Request["Description"];
                pro.Price = Convert.ToInt32(Request["Price"]);
                pro.Discount = Convert.ToInt32(Request["Discount"]);
                pro.Unit = Request["Unit"];
                db.Products.InsertOnSubmit(pro);
                db.SubmitChanges();
            }
            return this.Insert();
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
                return RedirectToAction("Index", "Log");
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