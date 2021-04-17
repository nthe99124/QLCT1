using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class DepartmentController : Controller
    {
        // GET: Department
        public ActionResult Index()
        {
            return View();
        }
        public QLCTDataContext db = new QLCTDataContext();
        // GET: User
        // View
        public ActionResult Index(int? page)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var viewuser = from d in db.Departments
                           where d.IsDeleted == false
                           orderby d.Name descending
                           select d;
            return View(viewuser.ToPagedList(page ?? 1, 5));

        }
        //Search View
        //[HttpPost]
        //public ActionResult Index(int? page)
        //{

        //    var search = " FROM(SELECT * FROM Cutomer WHERE Status = 1 AND IsDeleted = 0 ";


        //}
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            return View();
        }
        [HttpPost]
        public ActionResult Insert(Department dep)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var checkuser = db.Departments.Where(u => u.Name == Request["Name"]).FirstOrDefault();
            if (checkuser == null)
            {
                dep.Name = Request["Name"];
                dep.IdHeader = Convert.ToInt32(Request["IdHeader"]);
                if (Request["IdHeader"]==null)
                {
                    dep.NumberStaff = 0;
                }
                else
                {
                    dep.NumberStaff = 1;
                }
                dep.IsDeleted = false;
                db.Departments.InsertOnSubmit(dep);
                db.SubmitChanges();
            }
            else
            {
                ViewBag.check = "Phòng ban đã tồn tại";
            }
            return this.Insert();
        }
        // Update
        public ActionResult Update(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var dep = db.Departments.First(d => d.Id == id);
            return View(dep);
        }
        [HttpPost]
        public ActionResult Update(int id, Department dep)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            dep = db.Departments.Where(d => d.Id == id).SingleOrDefault();
            dep.Name = Request["Name"];
            dep.IdHeader = Convert.ToInt32(Request["IdHeader"]);
            if (Request["IdHeader"] == null)
            {
                dep.NumberStaff = 0;
            }
            else
            {
                dep.NumberStaff = 1;
            }
            dep.IsDeleted = false;
            UpdateModel(dep);
            db.SubmitChanges();
            return this.Update(id);
        }
        // Delete -- Update IsDelete
        public ActionResult Delete(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult Delete(int id, Department dep)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "login");
            }
            if (Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            dep = db.Departments.Where(u => u.Id == id).SingleOrDefault();
            dep.IsDeleted = true;
            UpdateModel(dep);
            db.SubmitChanges();
            return this.Delete(id);
        }
    }
}