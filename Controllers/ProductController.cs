using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class ProductController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult Index(int? page)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewpro = from p in db.Products
                          orderby p.Name descending
                          select p;
            return View(viewpro.ToPagedList(page ?? 1, 20));
        }
        //[HttpPost]
        //public ActionResult Index(int? page, FormCollection a)
        //{
        //    var viewpro = from p in db.Products
        //                  where p.Name.Contains(Request["key"])
        //                  select p;
        //    return View(viewpro.ToPagedList(page ?? 1, 20));
        //}
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
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
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
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
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
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
            pro.Price = Decimal.Parse(Request["Price"]);
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