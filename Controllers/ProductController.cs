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
            return View(viewpro.ToPagedList(page ?? 5, 5));
        }
        [HttpPost]
        public ActionResult Index(int? page, FormCollection a)
        {
            var viewpro = from p in db.Products
                          where p.Name.Contains(Request["key"])
                          select p;
            return View(viewpro.ToPagedList(page ?? 5, 5));
        }
        public JsonResult ListPro()
        {
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(db.Products.Select(p => p));
            return Json(result, JsonRequestBehavior.AllowGet);
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
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.lstPro = db.Products.Select(p => p);
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
            var index = Convert.ToInt32(Request["hiddenIndex"]);
            var remove = Request["remove"];
            for (int i = 0; i < index; i++)
            {
                var remove1 = " " + i.ToString() + " ";
                if (remove1.Contains(remove))
                {
                    continue;
                }
                else
                {
                    pro.Name = Request["NamePro"];
                    pro.NumberRemain = Convert.ToInt32(Request["NumberRemain"]);
                    pro.Description = Request["Description"];
                    pro.Price = Convert.ToInt32(Request["Price"]);
                    pro.Discount = Convert.ToInt32(Request["Discount"]);
                    pro.Unit = Request["Unit"];
                    pro.MonthOfGuarantee = Convert.ToInt32(Request["MonthOfGuarantee"]);
                    db.Products.InsertOnSubmit(pro);
                }
            }
            db.SubmitChanges();
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
            pro.MonthOfGuarantee = Convert.ToInt32(Request["MonthOfGuarantee"]);
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